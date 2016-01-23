import webapp2
import os
import cgi
import json
from google.appengine.ext import db
from hashids import Hashids
from guests import guests as guest_list

hashids = Hashids('caramel', 6, 'abcdefghksxyz2345689')

MEAL = {
    'LOBSTER': 0,
    'CHICKEN': 1,
    'VEGGIE': 2
}

ATTENDANCE = {
    'YES': 1,
    'NO': 2
}


class Guest(db.Model):
    name = db.StringProperty(required=True)
    #party = db.ReferenceProperty(Party,
    #                             collection_name='guests')
    attendance = db.IntegerProperty()
    meal = db.IntegerProperty()
    id = db.IntegerProperty()
    is_plus_one = db.BooleanProperty(default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'attendance': self.attendance,
            'meal': self.meal,
            'isPlusOne': self.is_plus_one
        }

class Party(db.Model):
    name = db.StringProperty(required=True)
    id = db.IntegerProperty()
    max_guests = db.IntegerProperty()
    note = db.TextProperty()

    def to_dict(self):
        return {
            'code': hashids.encode(self.id), 
            'maxGuests': self.max_guests,
            'note': self.note,
            'guests': [x.to_dict() for x in Guest.all().ancestor(self)]
        }

class RsvpApi(webapp2.RequestHandler):
    err_msg = 'A valid code parameter is required'

    def _get_id(self, id=None):
        if not id and 'code' in self.request.body:
            try:
                data = json.loads(self.request.body)
                id = data.get('code')
            except ValueError:
                return None
        else:
            id = id if id else self.request.get('code')

        if not id:
            return None

        decoded_id = hashids.decode(str(id).lower())
        if not decoded_id:
            return None

        try:
            decoded_id = decoded_id[0]
        except IndexError:
            return None

        try:
            decoded_id = int(decoded_id)
        except ValueError:
            return None

        return decoded_id

    def get(self):
        decoded_id = self._get_id()
        print decoded_id
        if not decoded_id:
            self.response.set_status(400, self.err_msg)
            return

        party = db.GqlQuery('SELECT * FROM Party WHERE id = :1 LIMIT 1', decoded_id).get()

        if not party:
            party = next((item for item in guest_list if item["id"] == decoded_id), None)
            if not party:
                self.response.set_status(404)
                return

            p = party.copy()
            guests = p.pop('guests')
            party = Party(**p)
            db.put(party)

            for guest in guests:
                g = Guest(parent=party, **guest)
                db.put(g)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(party.to_dict()))

    def post(self):
        """
        {
            'code': 'xg43c',
            'note': 'wooo party',
            'guests': [
                {
                    'id': 0,
                    'attendance': 1,
                    'meal': 1
                },
                {
                    'name': 'Emily',
                    'attendance': 1,
                    'meal': 2
                }
            ]
        }
        """
        #print self.request.__dict__
        #guest = Guest(name=self.request.get('name'))
        #db.put(guest)

        p = Party(id=1, name="Butler", max_guests=2, note="Hi")
        db.put(p)

        g = Guest(id=1, name="Justin", party=p)
        db.put(g)

        decoded_id = self._get_id()
        if not decoded_id:
            self.response.set_status(400, self.err_msg)

        party = db.GqlQuery('SELECT * FROM Party WHERE id = :1 LIMIT 1', decoded_id).get()
        if not party:
            self.response.set_status(404)
            return

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(party.to_dict()))


application = webapp2.WSGIApplication([
    ('/api/rsvp', RsvpApi)
], debug=True)
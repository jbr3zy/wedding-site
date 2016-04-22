import webapp2
import os
import cgi
import json
import time
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
    name = db.StringProperty(default='')
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
    name = db.StringProperty(default='')
    id = db.IntegerProperty()
    max_guests = db.IntegerProperty()
    note = db.TextProperty(default='')

    def to_dict(self):
        return {
            'code': hashids.encode(self.id), 
            'maxGuests': self.max_guests,
            'note': self.note,
            'guests': [x.to_dict() for x in Guest.all().ancestor(self).order('id')]
        }

class RsvpApi(webapp2.RequestHandler):
    err_msg = 'A valid code parameter is required'

    @db.transactional
    def _save(self, entities):
        db.put(entities)

    def _get_id(self, id=None):
        data = str(self.request.body)
        if not id and 'code' in data:
            try:
                data = json.loads(str(data))
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

            entities = []
            for guest in guests:
                entities.append(Guest(parent=party, **guest))
            self._save(entities)

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
        decoded_id = self._get_id()
        if not decoded_id:
            self.response.set_status(400, self.err_msg)
            return

        party = db.GqlQuery('SELECT * FROM Party WHERE id = :1 LIMIT 1', decoded_id).get()
        if not party:
            self.response.set_status(404)
            return

        try:
            data = json.loads(self.request.body)
        except ValueError:
            self.response.set_status(400)
            return

        if not 'guests' in data:
            self.response.set_status(400)
            return

        if 'note' in data:
            party.note = data['note']

        extras_allowed = max(0, party.max_guests - Guest.all().ancestor(party).count())
        entities = []

        for guest in data['guests']:
            if 'id' in guest:
                g = Guest.all().ancestor(party).filter('id =', guest['id']).get()
            elif extras_allowed:
                extras_allowed -= 1
                g = Guest(parent=party, id=party.max_guests-extras_allowed, is_plus_one=True)

            if not g:
                continue

            if 'meal' in guest:
                g.meal = guest['meal']
            if 'attendance' in guest:
                g.attendance = guest['attendance']
            if 'name' in guest and g.is_plus_one:
                g.name = guest['name']

            entities.append(g)

        self._save(entities)
        db.put(party)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(party.to_dict()))


application = webapp2.WSGIApplication([
    ('/api/rsvp', RsvpApi)
], debug=True)
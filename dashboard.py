from google.appengine.ext import db
from google.appengine.api import users
import webapp2

from rsvp import Guest, Party
from rsvp import ATTENDANCE, MEAL

ATTENDANCE_STRING = {v: k for k, v in ATTENDANCE.items()}
ATTENDANCE_STRING[None] = ''
MEAL_STRING = {v: k for k, v in MEAL.items()}
MEAL_STRING[None] = ''


class MainPage(webapp2.RequestHandler):
    def get(self):
        # Checks for active Google account session
        user = users.get_current_user()
        if not user:
        	self.redirect(users.create_login_url(self.request.uri))

        guest_count = Guest.all().filter('attendance =', ATTENDANCE['YES']).count()
        lobster_count = Guest.all().filter('attendance =', ATTENDANCE['YES']).filter('meal =', MEAL['LOBSTER']).count()
        chicken_count = Guest.all().filter('attendance =', ATTENDANCE['YES']).filter('meal =', MEAL['CHICKEN']).count()
        veggie_count = Guest.all().filter('attendance =', ATTENDANCE['YES']).filter('meal =', MEAL['VEGGIE']).count()

        html = '<html><body><style>table{margin-bottom: 25px;border-collapse: collapse;}td{border:1px solid; padding:6px; min-width:70px; min-height:30px; max-width:300px; word-wrap:break-word;}</style>'
        html += '<table><tr><td>Total Guests</td><td>Lobster</td><td>Chicken</td><td>Veggie</td></tr>'
        html += '<tr><td>' + str(guest_count) + '</td><td>' + str(lobster_count) + '</td>'
        html += '<td>' + str(chicken_count) + '</td>' + '<td>' + str(veggie_count) + '</td></tr></table>'

        for party in Party.all():
            html += '<table>'
            html += '<tr><td>Code</td><td>' + party.to_dict().get('code') + '</td></tr>'
            html += '<tr><td>Max guests:</td><td>' + str(party.max_guests) + '</td></tr>'
            html += '<tr><td>Note</td><td colspan=2>' + party.note + '</td></tr>'
            for guest in Guest.all().ancestor(party):
                html += '<tr><td>' + (guest.name if guest.name else 'Plus one') + '</td>'
                html += '<td>' + ATTENDANCE_STRING[guest.attendance] + '</td>'
                html += '<td>' + (MEAL_STRING[guest.meal] if guest.attendance == ATTENDANCE['YES'] else '') + '</td></tr>'
            html += '</table>'

        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        self.response.write(html)


class AllPage(webapp2.RequestHandler):
    def get(self):
        # Checks for active Google account session
        user = users.get_current_user()
        if not user:
            self.redirect(users.create_login_url(self.request.uri))

        guest_count = Guest.all().filter('attendance =', ATTENDANCE['YES']).count()
        lobster_count = Guest.all().filter('attendance =', ATTENDANCE['YES']).filter('meal =', MEAL['LOBSTER']).count()
        chicken_count = Guest.all().filter('attendance =', ATTENDANCE['YES']).filter('meal =', MEAL['CHICKEN']).count()
        veggie_count = Guest.all().filter('attendance =', ATTENDANCE['YES']).filter('meal =', MEAL['VEGGIE']).count()

        html = '<html><body><style>.no{color:#CCC;} table{margin-bottom: 25px;border-collapse: collapse;}td{border:1px solid #A7A7A7; padding:6px; min-width:70px; min-height:30px; max-width:300px; word-wrap:break-word;}</style>'
        html += '<table><tr><td>Total Guests</td><td>Lobster</td><td>Chicken</td><td>Veggie</td></tr>'
        html += '<tr><td>' + str(guest_count) + '</td><td>' + str(lobster_count) + '</td>'
        html += '<td>' + str(chicken_count) + '</td>' + '<td>' + str(veggie_count) + '</td></tr></table>'

        html += '<table>'
        for party in Party.all():
            for guest in Guest.all().ancestor(party):
                html += ('<tr>' if guest.attendance == ATTENDANCE['YES'] else '<tr class="no">')
                html += '<td>' + (guest.name if guest.name else 'Plus one') + '</td>'
                html += '<td>' + ATTENDANCE_STRING[guest.attendance] + '</td>'
                html += '<td>' + (MEAL_STRING[guest.meal] if guest.attendance == ATTENDANCE['YES'] else '') + '</td></tr>'
        html += '</table>'

        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        self.response.write(html)

application = webapp2.WSGIApplication([
    ('/dashboard/?', MainPage),
    ('/dashboard/all/?', AllPage),
], debug=True)
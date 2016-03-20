from google.appengine.ext import db
from google.appengine.api import users
import webapp2

from rsvp import Guest, Party
from rsvp import ATTENDANCE, MEAL

ATTENDANCE_STRING = {v: k for k, v in ATTENDANCE.items()}
MEAL_STRING = {v: k for k, v in MEAL.items()}


class MainPage(webapp2.RequestHandler):

    def get(self):
        # Checks for active Google account session
        user = users.get_current_user()
        if not user:
        	self.redirect(users.create_login_url(self.request.uri))

        html = '<html><body>'
        for party in Party.all():
        	html += '<table>'
        	html += '<tr><td>Code</td><td>' + party.to_dict().get('code') + '</td></tr>'
        	html += '<tr><td>Note</td><td>' + party.note + '</td></tr>'
        	html += '<tr><td>Max guests:</td><td>' + str(party.max_guests) + '</td></tr>'
        	guests = Guest.all()
        	for guest in guests:
        		html += '<tr><td>' + guest.name + '</td>'
        		html += '<td>' + ATTENDANCE_STRING[guest.attendance] + '</td>'
        		html += '<td>' + (MEAL_STRING[guest.meal] if guest.attendance == ATTENDANCE['YES'] else '') + '</td></tr>'
        	html += '</table>'
            
        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        # self.response.write('Hello, ' + user.email())

        self.response.write(html)

application = webapp2.WSGIApplication([
    ('/dashboard', MainPage),
], debug=True)
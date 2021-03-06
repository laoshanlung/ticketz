from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms.models import model_to_dict 
from core.models import AbstractModel, TicketType, SoldTicket
import time
import uuid
from django.utils.translation import ugettext as _

class UserException(Exception):
    pass

class User(AbstractUser, AbstractModel):
    is_external = models.BooleanField(default=True)

    def get_social_user(self):
        if self.is_external:
            return self.social_auth.all()[0]
        return None

    class Meta:
        app_label = "core"

    def json_data(self, exclude=[]):
        data = model_to_dict(self, fields=['id', 'username', 'first_name', 'last_name', 'email'])
        data = {key: value for key, value in data.iteritems() if key not in exclude}

        social_user = self.get_social_user()
        if social_user:
            data['social_user'] = {
                'provider': social_user.provider
            }
        return data

    def purchase_ticket(self, ticket_type_id):
        ticket_type = TicketType.objects.get(pk=ticket_type_id)
        current_time = round(time.time() * 1000)

        event = ticket_type.event

        if not event.is_active:
            raise UserException(_("Hold your breath, the organizer is trying to publish the event as soon as possible"))

        if current_time > event.end_date:
            raise UserException(_("The event has been ended"))

        if ticket_type.get_amount_left() <= 0:
            raise UserException(_("No ticket left to buy"))

        data = {
            'ticket_type_id': ticket_type_id,
            'code': SoldTicket.random_code(),
            'event_id': event.id
        }
        sold_ticket = self.tickets.create(**data)

        if sold_ticket:
            sold_ticket.generate_qr_code()
            sold_ticket.generate_pdf()
            sold_ticket.send_email()

        return sold_ticket
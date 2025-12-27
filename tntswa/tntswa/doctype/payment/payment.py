# Copyright (c) 2025, TNTSWA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import money_in_words

from frappe.model.document import Document
from frappe import _

class Payment(Document):
	def validate(self):
		if self.amount:
			rupees = int(float(self.amount))
			self.amount_in_words = (
				number_to_tamil_words(rupees)
				+ " "
			)

	def on_submit(self):
		if (not self.district_in_charge_signature and not self.state_in_charge_signature):
			frappe.throw("ஒப்புதலுக்கு மாவட்ட பொறுப்பாளர் அல்லது மாநில பொறுப்பாளர் கையொப்பம் கட்டாயம்.")


def number_to_tamil_words(num):
	units = [
		"", "ஒன்று", "இரண்டு", "மூன்று", "நான்கு",
		"ஐந்து", "ஆறு", "ஏழு", "எட்டு", "ஒன்பது"
	]

	teens = [
		"பத்து", "பதினொன்று", "பன்னிரண்டு", "பதிமூன்று", "பதினான்கு",
		"பதினைந்து", "பதினாறு", "பதினேழு", "பதினெட்டு", "பத்தொன்பது"
	]

	tens = [
		"", "", "இருபது", "முப்பது", "நாற்பது",
		"ஐம்பது", "அறுபது", "எழுபது", "எண்பது", "தொண்ணூறு"
	]

	if num == 0:
		return "பூஜ்ஜியம்"

	if num < 10:
		return units[num]

	if num < 20:
		return teens[num - 10]

	if num < 100:
		return tens[num // 10] + (" " + units[num % 10] if num % 10 else "")

	if num < 1000:
		return (
			units[num // 100]
			+ " நூறு"
			+ (" " + number_to_tamil_words(num % 100) if num % 100 else "")
		)

	if num < 100000:
		return (
			number_to_tamil_words(num // 1000)
			+ " ஆயிரம்"
			+ (" " + number_to_tamil_words(num % 1000) if num % 1000 else "")
		)

	if num < 10000000:
		return (
			number_to_tamil_words(num // 100000)
			+ " லட்சம்"
			+ (" " + number_to_tamil_words(num % 100000) if num % 100000 else "")
		)

	return (
		number_to_tamil_words(num // 10000000)
		+ " கோடி"
		+ (" " + number_to_tamil_words(num % 10000000) if num % 10000000 else "")
	)

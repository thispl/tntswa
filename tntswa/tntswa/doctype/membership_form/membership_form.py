# Copyright (c) 2025, TNTSWA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class MembershipForm(Document):
	def before_insert(self):
		district_code = self.district_short_code  

		last_id = frappe.db.get_value(
			"Membership Form",
			filters={"district_short_code": district_code,'amended_from':["is", "not set"]},
			fieldname="name",
			order_by="creation desc"
		)

		if last_id:
			last_num = int(last_id.split("-")[-1])
			new_num = last_num + 1
		else:
			new_num = 1

		self.membership_series = f"MEM-{district_code}-{new_num:05d}"


	def validate(self):
		if self.workflow_state == "Approved" and (not self.state_president_signature and not self.state_general_manager_sign):
			frappe.throw("ஒப்புதலுக்கு மாநிலத் தலைவர் அல்லது மாநில பொதுச் செயலாளர் கையொப்பம் கட்டாயம்.")





# Copyright (c) 2025, TNTSWA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class District(Document):
	def validate(self):
		doc_manager = frappe.get_single("Document Manager")

		for row in self.get("document_manager"):
			doc_manager.append("document_manager", {
				"district": row.district,
				"document_title": row.document_title,
				"document":row.document
			})

		doc_manager.save(ignore_permissions=True)

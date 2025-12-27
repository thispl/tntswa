# Copyright (c) 2025, TNTSWA and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class DocumentView(Document):
	pass


@frappe.whitelist()
def get_document_manager_data():
	
	docs = frappe.get_single('Document Manager')
	
	
	document_manager_data = []

	for doc in docs.document_manager:  
		document_manager_data.append({
			'name':doc.name,
			'document_title': doc.document_title,
			'district': doc.district,
			'document':doc.document
			
		})
	
	
	return document_manager_data


@frappe.whitelist()
def get_document_manager_data_district(district=None):
	
	docs = frappe.get_single('Document Manager')
	
	
	document_manager_data = []

	for doc in docs.document_manager:
		if not district or doc.district == district:  
			document_manager_data.append({
				'name':doc.name,
				'document_title': doc.document_title,
				'district': doc.district,
				'document':doc.document
				
			})
	
	
	return document_manager_data
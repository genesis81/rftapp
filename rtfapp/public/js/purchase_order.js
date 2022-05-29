frappe.ui.form.on('Purchase Order', {
    refresh(frm) {
        if (frm.doc.docstatus === 0) {
            frm.add_custom_button(__("Order Planning"), function() {
                if (frm.doc.supplier) {
                    get_items_from_order_planning(frm);
                }
            }, __("Get items from"));
        }
    },
    validate(frm){
        if (frm.doc.items) {
            var text = "";
            var changed = false;
            for (var i = 0; i < frm.doc.items.length; i++) {
                if (frm.doc.items[i].packing_unit > 0){
                    console.log("Test before_save 2");
                    if(frm.doc.items[i].qty % frm.doc.items[i].packing_unit !== 0.0){
                        text += (__("Verpackungseinheit für Artikel {0} ist {1} Menge von {2} auf {3} angepasst.</br>",[frm.doc.items[i].item_name,frm.doc.items[i].packing_unit,frm.doc.items[i].qty,frm.doc.items[i].qty + (frm.doc.items[i].packing_unit - (frm.doc.items[i].qty % frm.doc.items[i].packing_unit))]));
                        frm.doc.items[i].qty += (frm.doc.items[i].packing_unit - (frm.doc.items[i].qty % frm.doc.items[i].packing_unit));
                        changed = true;
                        //frappe.msgprint(__("Verpackungseinheit für Artikel {0} ist {1}",[frm.doc.items[i].item_name,frm.doc.items[i].packing_unit]));
                        //frappe.validated = false;
                    }
                }
            }
            if(changed)
            {
                frappe.msgprint(text);
            }
        }
    }
});

frappe.ui.form.on("Purchase Order Item", {
    item_code: function(frm, cdt, cdn) {
      var d = locals[cdt][cdn];
      frappe.db.get_value('Item',d.item_code, 'packing_unit').then(r => {console.log(d.doctype + " - " + d.name + 'packing_unit' + r.message.packing_unit); frappe.model.set_value(d.doctype, d.name, 'packing_unit', r.message.packing_unit);}); 
  }
});

// this function will get all items that have negative projected quanitites for the selected supplier
function get_items_from_order_planning(frm) {
    var filters = {'supplier': frm.doc.supplier};
    frappe.call({
        "method": "rtfapp.rheintaler_turnfest.report.order_planning.order_planning.get_data",
        "args": {
            "filters": filters
        },
        "callback": function(response) {
            var data = response.message;
            if (data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    var child = cur_frm.add_child('items');
                    frappe.model.set_value(child.doctype, child.name, 'item_code', data[i].item_code);
                    if(data[i].to_purchase == null){
                        frappe.model.set_value(child.doctype, child.name, 'qty', (data[i].to_order));
                    }else{
                        frappe.model.set_value(child.doctype, child.name, 'qty', (data[i].to_purchase));
                    }
                }
                cur_frm.refresh_field('items');
                frappe.show_alert(__("Updated"));
            } 
        }
    });
}

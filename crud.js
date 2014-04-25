if (Meteor.isClient) {
    Template.personTable.persons = function () {
        return Persons.find();
    };

    Template.personTable.selected = function () {
        return Session.equals("selected", this._id) ? "selected" : "";
    };

    Template.personTable.events({
        'mousedown .person': function () {
            Session.set("selected", this._id);
        },
        'touchstart .person': function () {
            Session.set("selected", this._id);
        }
    });

    Template.actionButtons.selected = function () {
        return Session.get("selected") != null;
    };


    Template.actionButtons.events({
        'click .edit': function () {
            Session.set("editing", true);
        },
        'click .delete': function () {
            Persons.remove(Session.get("selected"));
            Session.set("selected", false);
            Session.set("editing", false);
        },
        'click .new': function () {
            Session.set("selected", false);
            Session.set("editing", true);
        }
    });

    Template.editForm.person = function () {
        return Session.get("editing") ? Persons.findOne(Session.get("selected")) : null;
    };
    Template.editForm.editing = function () {
        return Session.get("editing") === true;
    };

    var save = function () {
        var details = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            phoneNumber: $("#phoneNumber").val(),
            email: $("#email").val()
        };

        if (Session.get("selected") != false) {
            Persons.update(Session.get("selected"), details);
        } else {
            Persons.insert(details);
        }
        Session.set("editing", false);
    };

    var cancel = function () {
        Session.set("selected", null);
        Session.set("editing", false);
    };

    Template.editForm.events({
        'click .save': save,
        'click .cancel': cancel,
        'keyup input': function (evt) {
            if (evt.which === 13) {
                save();
            } else if (evt.which === 27) {
                cancel();
            }
        }
    });


}
Persons = new Meteor.Collection("persons");

if (Meteor.isServer) {
    Meteor.startup(function () {
        if (Persons.find().count() === 0) {
            [
                {
                    firstName: "Petri",
                    lastName: "Heinonen",
                    phoneNumber: "123123123",
                    email: "petri@poro.fi"
                },
                {
                    firstName: "Marcus",
                    lastName: "Hellberg",
                    phoneNumber: "123123123",
                    email: "marcus@poro.fi"
                }
            ].forEach(function (p) {
                    Persons.insert(p);
                });

        }
    });
}

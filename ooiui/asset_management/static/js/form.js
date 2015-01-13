// Since we are automatically updating the model, we want the model
// to also hold invalid values, otherwise, we might be validating
// something else than the user has entered in the form.
// See: http://thedersen.com/projects/backbone-validation/#configuration/force-update
Backbone.Validation.configure({
    forceUpdate: true
});

// Extend the callbacks to work with Bootstrap, as used in this example
// See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.removeClass('has-error');
        $group.find('.help-block').html('').addClass('hidden');
    },
    invalid: function (view, attr, error, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.addClass('has-error');
        $group.find('.help-block').html(error).removeClass('hidden');
    }
});

// Define a model with some validation rules
var SignUpModel = Backbone.Model.extend({
    defaults: {
        role: "Administrator",
        phone: "Work"
    },
    url: "/api/user/",
    
    validation: {
        username: {
            required: true
        },
        email: {
            required: true,
            pattern: 'email'
        },
        password: {
            minLength: 8
        },
        repeatPassword: {
            equalTo: 'password',
            msg: 'The passwords does not match'
        },
        phone: {
            oneOf: ['Work', 'Home','Cell']
        },
        role: {
            oneOf: ['Administrator']
        },
        phonenum: {
            required: true,
            pattern:'digits'
        }
    }
});

var SignUpForm = Backbone.View.extend({
    events: {
        'click #submitButton': function (e) {
            console.log("submit clicked");
            e.preventDefault();
            this.signUp();
        },
        'click #resetButton': function (e){
            
            this.reset();
        }
    },

    // Use stickit to perform binding between
    // the model and the view
    // See: https://github.com/NYTimes/backbone.stickit
    bindings: {
        '[name=username]': {
            observe: 'username',
            setOptions: {
                validate: true
            }
        },
            '[name=email]': {
            observe: 'email',
            setOptions: {
                validate: true
            }
        },
            '[name=password]': {
            observe: 'password',
            setOptions: {
                validate: true
            }
        },
            '[name=repeatPassword]': {
            observe: 'repeatPassword',
            setOptions: {
                validate: true
            }
        },
            '[name=phone]': {
            observe: 'phone',
            selectOptions: {
                collection: function () {
                    return ['Work', 'Home', 'Cell'];
                }
            },
            setOptions: {
                validate: true
            }
        },
            '[name=phonenum]': {
            observe: 'phonenum',
            setOptions: {
                validate: true
            }
        },    
            '[name=role]': {
            observe: 'role',
            selectOptions: {
                collection: function () {
                    return ['Administrator', 'Science User', 'Operator'];
                }
            },
            setOptions: {
                validate: true
            }
        },
            '[name=terms]': {
            observe: 'terms',
            setOptions: {
                validate: true
            }
        }
    },

    initialize: function () {
        // This hooks up the validation
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
        Backbone.Validation.bind(this);
    },

    render: function () {
        this.stickit();
        console.log("render clicked");
        console.log(this);
        return this;
    },

    signUp: function () {
        // Check if the model is valid before saving
        // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
        if (this.model.isValid(true)) {
            this.model.save();
            console.log(this.model.save());
            alert("User Registration Submitted");
        }
    },
    reset: function(){
        // resests the page. Not sure it's the correct procedure?? 
        console.log('reset clicked');
        window.location.reload();
        // maybe this?? this.model.set({name: "","email":""})
    },

    remove: function () {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});

$(function () {
    var view = new SignUpForm({
        el: 'form',
        model: new SignUpModel()
    });
    view.render();
});
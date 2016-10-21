// Array of locations
var locations = [
    {
        name: "Lake Margaret",
        lat: 47.769702,
        lng: -121.901639,
        // id: "" ?
    },
    {
        name: "Lake Shannon",
        lat: 48.561961,
        lng: -121.87395,
        // id: "" ?
    },
    {
        name: "Cle Elum Lake",
        lat: 47.279637,
        lng: -121.10405,
        // id: "" ?
    },
    {
        name: "Lake Wenatchee",
        lat: 47.824453,
        lng: lng: -120.777017,
        // id: "" ?
    },
    {
        name: "Big Lake",
        lat: 48.402883,
        lng: lng: -122.241265,
        // id: "" ?
    }
];

// Initialize the map
var map;
function initMap() {
    "use strict";
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.742322, lng: -121.985678},
        zoom: 10,
        styles: styles,
        mapTypeControl: false,
        // disableDefaultUI: true
    });
    // Start the ViewModel here so it doesn't initialize before Google Maps loads
    ko.applyBindings(new ViewModel());
}

// Alert the user if google maps isn't working
function googleError() {
    "use strict";
    document.getElementById('map').innerHTML = "<h2>Google Maps is not loading. Please try again later.</h2>";
}


var Place = function (data) {
    "use strict";
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    // this.id = ko.observable(data.id);
    this.marker = ko.observable();
    this.description = ko.observable('');
    this.address = ko.observable('');
    this.url = ko.observable('');
    this.canonicalUrl = ko.observable('');
    this.photoPrefix = ko.observable('');
    this.photoSuffix = ko.observable('');
    this.contentString = ko.observable('');
};


// ViewModel
var ViewModel = function () {
    "use strict";
    // Make this accessible
    var self = this;

    // Create an array of all places
    this.placeList = ko.observableArray([]);

    // Call the Place constructor
    // Create Place objects for each item in locations & store them in the above array
    locations.forEach(function (placeItem) {
        self.placeList.push(new Place(placeItem));
    });

    // Initialize the infowindow
    var infowindow = new google.maps.InfoWindow({
        maxWidth: 200,
    });

    // Initialize marker
    var marker;

};
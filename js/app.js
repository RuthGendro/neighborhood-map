// To Do
// Fix map styling
// Fix marker color changes
// Add data and additional js for trip descriptions

// Array of locations
var locations = [
    {
        name: "Lake Margaret",
        lat: 47.769702,
        lng: -121.901639,
        id: "4da1f29cb521224b8b6bffed"
    },
    {
        name: "Lake Shannon",
        lat: 48.561961,
        lng: -121.87395,
        id: "557ce43e498e4837f79083ee"
    },
    {
        name: "Cle Elum Lake",
        lat: 47.279637,
        lng: -121.10405,
        id: "55a9befb498e8f5cfae0e533"
    },
    {
        name: "Lake Wenatchee",
        lat: 47.824453,
        lng: -120.777017,
        id: "4b784595f964a5201cc12ee3"
    },
    {
        name: "Big Lake",
        lat: 48.402883,
        lng: -122.241265,
        id: "4c2cfd5d987f20a1e4ab48aa"
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

    var styles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    }
]
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
    this.id = ko.observable(data.id);
    this.marker = ko.observable();
    this.description = ko.observable('');
    this.address = ko.observable('');
    this.url = ko.observable('');
    this.rating = ko.observable('');
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

        // For each place, set markers, request Foursquare data, and set event listeners for the infowindow
    // Credit https://github.com/kacymckibben/project-5-app.git
    self.placeList().forEach(function (placeItem) {

        // Define markers for each place
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(placeItem.lat(), placeItem.lng()),
            map: map,
            animation: google.maps.Animation.DROP
        });
        placeItem.marker = marker;

        // Make AJAX request to Foursquare
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/' + placeItem.id() +
            '?client_id=NONGGLXBKX5VFFIKKEK1HXQPFAFVMEBTRXBWJUPEN4K14JUE&client_secret=ZZDD1SLJ4PA2X4AJ4V23OOZ53UM4SFZX0KORGWP5TZDK4YYJ&v=20130815',
            dataType: "json",
            success: function (data) {
                // Make results easier to handle
                var result = data.response.venue;

                // placeItem.name(result.name);

                // The following lines handle inconsistent results from Foursquare
                // Check each result for properties, if the property exists,
                // add it to the Place constructor


                var location = result.hasOwnProperty('location') ? result.location : '';
                if (location.hasOwnProperty('address')) {
                    placeItem.address(location.address || '');
                }

                var bestPhoto = result.hasOwnProperty('bestPhoto') ? result.bestPhoto : '';
                if (bestPhoto.hasOwnProperty('prefix')) {
                    placeItem.photoPrefix(bestPhoto.prefix || '');
                }

                if (bestPhoto.hasOwnProperty('suffix')) {
                    placeItem.photoSuffix(bestPhoto.suffix || '');
                }

                var description = result.hasOwnProperty('description') ? result.description : '';
                placeItem.description(description || '');

                var url = result.hasOwnProperty('url') ? result.url : '';
                placeItem.url(url || '');

                placeItem.canonicalUrl(result.canonicalUrl);

                // Infowindow code is in the success function so that the error message
                // displayed in infowindow works properly, instead of a mangled infowindow
                // Credit https://discussions.udacity.com/t/trouble-with-infowindows-and-contentstring/39853/14

                // Content of the infowindow
                var contentString = '<div id="iWindow"><h4>' + placeItem.name() + '</h4><div id="pic"><img src="' +
                        placeItem.photoPrefix() + '110x110' + placeItem.photoSuffix() +
                        '" alt="Image Location"></div><p>Information from Foursquare:</p><p>' +
                        placeItem.address() + '</p><p>' +
                        placeItem.description() + '</p><p>Rating: ' + placeItem.rating() +
                        '</p><p><a href=' + placeItem.url() + '>' + placeItem.url() +
                        '</a></p><p><a target="_blank" href=' + placeItem.canonicalUrl() +
                        '>Foursquare Page</a></p><p><a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' +
                        placeItem.lat() + ',' + placeItem.lng() + '>Directions</a></p></div>';

                // Add infowindows credit http://you.arenot.me/2010/06/29/google-maps-api-v3-0-multiple-markers-multiple-infowindows/
                google.maps.event.addListener(placeItem.marker, 'click', function () {
                    infowindow.open(map, this);
                    // Bounce animation credit https://github.com/Pooja0131/FEND-Neighbourhood-Project5a/blob/master/js/app.js
                    placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        placeItem.marker.setAnimation(null);
                    }, 500);
                    infowindow.setContent(contentString);
                });
            },
            // Alert the user on error. Set messages in the DOM and infowindow
            error: function (e) {
                infowindow.setContent('<h5>Foursquare data is unavailable. Please try refreshing later.</h5>');
                document.getElementById("error").innerHTML = "<h4>Foursquare data is unavailable. Please try refreshing later.</h4>";
            }
    });

        // This event listener makes the error message on AJAX error display in the infowindow
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, this);
            placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                placeItem.marker.setAnimation(null);
            }, 500);
        });
    });

    // Activate the appropriate marker when the user clicks a list item
    self.showInfo = function (placeItem) {
        google.maps.event.trigger(placeItem.marker, 'click');
        self.hideElements();
    };


    // Toggle the nav class based style
    self.toggleNav = ko.observable(false);
    this.navStatus = ko.pureComputed (function () {
        return self.toggleNav() === false ? 'nav' : 'navClosed';
        }, this);

    self.hideElements = function (toggleNav) {
        self.toggleNav(true);
        // Allow default action
        return true;
    };

    self.showElements = function (toggleNav) {
        self.toggleNav(false);
        return true;
    };


    // Filter markers per user input

    // Array containing only the markers based on search
    self.visible = ko.observableArray();

    // All markers are visible by default before any user input
    self.placeList().forEach(function (place) {
        self.visible.push(place);
    });

    // Track user input
    self.userInput = ko.observable('');

    // If user input is included in the place name, make it and its marker visible
    // Otherwise, remove the place & marker
    self.filterMarkers = function () {
        // Set all markers and places to not visible.
        var searchInput = self.userInput().toLowerCase();
        self.visible.removeAll();
        self.placeList().forEach(function (place) {
            place.marker.setVisible(false);
            // Compare the name of each place to user input
            // If user input is included in the name, set the place and marker as visible
            if (place.name().toLowerCase().indexOf(searchInput) !== -1) {
                self.visible.push(place);
            }
        });
        self.visible().forEach(function (place) {
            place.marker.setVisible(true);
        });
    };
};
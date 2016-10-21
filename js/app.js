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
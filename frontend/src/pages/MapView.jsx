import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import {
  FiNavigation,
  FiMapPin,
  FiCrosshair,
  FiLayers,
  FiSearch,
  FiAlertCircle,
} from "react-icons/fi";

import "leaflet/dist/leaflet.css";
import "../index.css";


function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 14, {
      duration: 1.5,
    });
  }, [center, map]);

  return null;
}


export default function MapView() {
  const [position, setPosition] = useState([28.6139, 77.2090]);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("New Delhi, India");

  const works = [
    {
      id: 1,
      name: "Metro Road Development",
      location: "Sector 18",
      position: [28.6129, 77.2295],
      status: "In Progress",
    },
    {
      id: 2,
      name: "Public Park Renovation",
      location: "Noida",
      position: [28.6219, 77.2190],
      status: "Verified",
    },
    {
      id: 3,
      name: "Water Pipeline Project",
      location: "Delhi NCR",
      position: [28.6039, 77.1990],
      status: "Under Review",
    },
  ];


  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (currentPosition) => {
        const latitude = currentPosition.coords.latitude;
        const longitude = currentPosition.coords.longitude;

        setPosition([latitude, longitude]);
        setLocationName("Your Current Location");

        setLoading(false);
      },
      () => {
        alert("Unable to access your location. Please allow location permission.");
        setLoading(false);
      }
    );
  };


  return (
    <div className="map-page">

      {/* PAGE HEADER */}

      <div className="map-top-section">

        <div>
          <p className="map-label">
            LIVE TRANSPARENCY NETWORK
          </p>

          <h1>
            Explore <span>Public Work</span>
          </h1>

          <p>
            Discover infrastructure projects, evidence,
            verification activity and real-time updates
            happening around you.
          </p>
        </div>


        <button
          className="location-btn"
          onClick={getCurrentLocation}
        >
          <FiCrosshair />

          {loading
            ? "LOCATING..."
            : "USE MY LOCATION"}
        </button>

      </div>


      {/* MAP LAYOUT */}

      <div className="map-layout">


        {/* LEFT PANEL */}

        <aside className="map-sidebar">

          <div className="map-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search location..."
            />

          </div>


          <div className="map-sidebar-title">

            <div>

              <p>ACTIVE PROJECTS</p>

              <h3>
                Works Near You
              </h3>

            </div>

            <span>
              03
            </span>

          </div>


          <div className="map-work-list">

            {works.map((work) => (

              <div
                className="map-work-card"
                key={work.id}
                onClick={() => {
                  setPosition(work.position);
                  setLocationName(work.location);
                }}
              >

                <div className="map-work-icon">
                  <FiMapPin />
                </div>


                <div className="map-work-info">

                  <h4>
                    {work.name}
                  </h4>

                  <p>
                    {work.location}
                  </p>

                  <span
                    className={`map-status ${work.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {work.status}
                  </span>

                </div>


                <FiNavigation className="work-arrow" />

              </div>

            ))}

          </div>


          <div className="map-location-info">

            <div className="location-info-icon">
              <FiNavigation />
            </div>

            <div>

              <span>
                CURRENT VIEW
              </span>

              <strong>
                {locationName}
              </strong>

            </div>

          </div>

        </aside>



        {/* MAP */}

        <section className="real-map-container">

          <MapContainer
            center={position}
            zoom={13}
            className="leaflet-map"
          >

            <TileLayer
              attribution='© OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            <ChangeMapView center={position} />


            {/* USER LOCATION */}

            <Marker position={position}>

              <Popup>
                <strong>
                  {locationName}
                </strong>

                <br />

                Current map location

              </Popup>

            </Marker>


            <Circle
              center={position}
              radius={600}
              pathOptions={{
                color: "#b8f52a",
                fillColor: "#b8f52a",
                fillOpacity: 0.08,
              }}
            />


            {/* PROJECT MARKERS */}

            {works.map((work) => (

              <Marker
                key={work.id}
                position={work.position}
              >

                <Popup>

                  <div className="popup-content">

                    <strong>
                      {work.name}
                    </strong>

                    <p>
                      📍 {work.location}
                    </p>

                    <span>
                      {work.status}
                    </span>

                  </div>

                </Popup>

              </Marker>

            ))}

          </MapContainer>


          {/* MAP FLOATING CONTROLS */}

          <div className="map-floating-panel">

            <button title="Projects">
              <FiLayers />
            </button>

            <button title="Issues">
              <FiAlertCircle />
            </button>

            <button
              onClick={getCurrentLocation}
              title="My Location"
            >
              <FiCrosshair />
            </button>

          </div>


          {/* MAP BOTTOM INFO */}

          <div className="map-live-status">

            <span className="live-dot"></span>

            LIVE DATA

            {/* NOTE: the works list above and the counter that
                used to be hardcoded here are placeholder/demo
                data. No backend endpoint for map works was
                confirmed in this project — wire this up to
                workApi.getWorks() (or a dedicated map endpoint)
                once one exists, instead of hardcoding markers. */}

          </div>

        </section>

      </div>

    </div>
  );
}
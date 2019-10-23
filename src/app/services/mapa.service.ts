import { Injectable, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { mapStyle } from '../shared/mapStyle';

declare var google;
declare var MarkerClusterer;

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  locations: any;
  markerCluster: any;
  activeInfoWindow: any;
  locMarkers: any[];
  locInfo: any[];

  constructor(private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
    this.locations = [
      { lat: -31.56391, lng: 147.154312 },
      { lat: -33.718234, lng: 150.363181 },
      { lat: -33.727111, lng: 150.371124 },
      { lat: -33.848588, lng: 151.209834 },
      { lat: -33.851702, lng: 151.216968 },
      { lat: -34.671264, lng: 150.863657 },
      { lat: -35.304724, lng: 148.662905 },
      { lat: -36.817685, lng: 175.699196 },
      { lat: -36.828611, lng: 175.790222 },
      { lat: -37.75, lng: 145.116667 },
      { lat: -37.759859, lng: 145.128708 },
      { lat: -37.765015, lng: 145.133858 },
      { lat: -37.770104, lng: 145.143299 },
      { lat: -37.7737, lng: 145.145187 },
      { lat: -37.774785, lng: 145.137978 },
      { lat: -37.819616, lng: 144.968119 },
      { lat: -38.330766, lng: 144.695692 },
      { lat: -39.927193, lng: 175.053218 },
      { lat: -41.330162, lng: 174.865694 },
      { lat: -42.734358, lng: 147.439506 },
      { lat: -42.734358, lng: 147.501315 },
      { lat: -42.735258, lng: 147.438 },
      { lat: -43.999792, lng: 170.463352 }
    ];
  }

  loadMap(mapElement: ElementRef): Promise<any> {
    return this.geolocation
      .getCurrentPosition()
      .then(
        resp =>
          new google.maps.Map(mapElement.nativeElement, {
            center: new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: false,
            disableDefaultUI: true,
            zoomControl: true,
            styles: mapStyle
          })
      )
      .catch(error => {
        console.log('Error getting location', error);
      });
  }

  addSearchBox(map: any, input: ElementRef) {
    const searchBox = new google.maps.places.SearchBox(input.nativeElement);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input.nativeElement);

    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  markerClick(map: any) {
    let markerClick;
    google.maps.event.addListener(map, 'click', event => {
      if (markerClick == null) {
        markerClick = new google.maps.Marker({
          position: event.latLng,
          animation: google.maps.Animation.DROP,
          icon: 'assets/map/marker.png',
          map
        });
      } else {
        markerClick.setPosition(event.latLng);
      }
      map.panTo(event.latLng);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ latLng: event.latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            for (const result of results) {
              if (result.types[0] === 'administrative_area_level_2') {
                console.log(result.address_components[0].short_name);
              } else if (result.types[0] === 'administrative_area_level_1') {
                console.log(result.address_components[0].short_name);
              } else if (result.types[0] === 'country') {
                console.log(result.address_components[0].short_name);
              }
            }
          } else {
            console.log('No reverse geocode results.');
          }
        } else {
          console.log('Geocoder failed: ' + status);
        }
      });
    });
  }

  showItens(map: any) {
    const markers = this.locations.map(location => {
      return new google.maps.Marker({
        position: location,
        map,
        animation: google.maps.Animation.DROP,
        icon: 'assets/map/marker.png'
      });
    });

    this.markerCluster = new MarkerClusterer(map, markers, {
      //maxZoom: 15,
      imagePath: 'assets/map/m'
    });

    google.maps.event.addListener(this.markerCluster, 'clusterclick', cluster => {
      map.setCenter(cluster.getCenter());
      map.setZoom(map.getZoom());
    });

    markers.forEach((marker, i) => {
      marker.addListener('click', () => {
        if (this.activeInfoWindow) {
          this.activeInfoWindow.close();
        }
        const infowindow = new google.maps.InfoWindow({
          content:
            '<div class="info-window text-center">' +
            '<img src="resources/img/bg.jpg" alt="Objeto Image" class="img-raised rounded-circle img-fluid" width="100px">' +
            '<h3>Titulo</h3>' +
            '<div class="info-content">' +
            '<p>Descricao</p>' +
            '</div>' +
            '<a href="ObjetoServlet?id=10" class="badge badge-pill badge-secondary">Ver Mais</a>' +
            '</div>',
          maxWidth: 400
        });
        infowindow.open(map, marker);
        this.activeInfoWindow = infowindow;
      });
    });
  }
}

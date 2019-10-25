import { Injectable, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { mapStyle } from '../shared/mapStyle';
import { FormControl } from '@angular/forms';

declare var google;
declare var MarkerClusterer;

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  lastWindow: any = null;

  constructor(private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {}

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
            styles: mapStyle
          })
      )
      .catch(
        error =>
          new google.maps.Map(mapElement.nativeElement, {
            center: new google.maps.LatLng(-13.83, -48.02),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: false,
            disableDefaultUI: true,
            styles: mapStyle
          })
      );
  }

  addActionButton(map: any, button: any) {
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(button.nativeElement);
  }

  addZoomControl(map: any, control: any, zoonIn: any, zoonOut: any) {
    zoonIn.nativeElement.onclick = () => {
      map.setZoom(map.getZoom() + 1);
    };
    zoonOut.nativeElement.onclick = () => {
      map.setZoom(map.getZoom() - 1);
    };
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(control.nativeElement);
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

  markerClick(
    map: any,
    cidade: FormControl,
    uf: FormControl,
    pais: FormControl,
    latLng: FormControl
  ) {
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
                cidade.setValue(result.address_components[0].short_name);
              } else if (result.types[0] === 'administrative_area_level_1') {
                uf.setValue(result.address_components[0].short_name);
              } else if (result.types[0] === 'country') {
                pais.setValue(result.address_components[0].short_name);
              }
            }
            latLng.setValue(
              '{"lat": ' + event.latLng.lat() + ', "lng": ' + event.latLng.lng() + '}'
            );
          } else {
            console.log('No reverse geocode results.');
          }
        } else {
          console.log('Geocoder failed: ' + status);
        }
      });
    });
  }

  showItens(
    map: any,
    locations: { latlng: {}; id: string; title: string; descricao: string; situacao: string }[],
    window: any
  ) {
    const markers = locations.map(location => {
      return new google.maps.Marker({
        position: location.latlng,
        map,
        animation: google.maps.Animation.DROP,
        icon:
          location.situacao === 'perdido'
            ? 'assets/map/marker_perdido.png'
            : 'assets/map/marker_achado.png'
      });
    });

    const markerCluster = new MarkerClusterer(map, markers, {
      imagePath: 'assets/map/m'
    });

    google.maps.event.addListener(markerCluster, 'clusterclick', cluster => {
      map.setCenter(cluster.getCenter());
      map.setZoom(map.getZoom());
    });

    markers.forEach((marker, i) => {
      marker.addListener('click', () => {
        if (this.lastWindow) {
          this.lastWindow.close();
        }
        const infowindow = new google.maps.InfoWindow({
          content:
            '<ion-card class="ion-text-center" style="margin-left: 2px; margin-right: 2px">' +
            '<ion-item class="bg-class">' +
            '<ion-label>' +
            locations[i].title +
            '</ion-label>' +
            '</ion-item>' +
            '<ion-card-content>' +
            '<div>' +
            locations[i].descricao +
            '</div>' +
            '<ion-note color="danger">' +
            locations[i].situacao +
            '</ion-note>' +
            '</ion-card-content>' +
            '</ion-card>' +
            '<ion-button onClick="window.ionicPageRef.zone.run(function () { window.ionicPageRef.component.showItemInfo(\'' +
            locations[i].id +
            '\') })"' +
            'expand="block" style="color:#fff"> Ver Mais </ion-button>',
          maxWidth: 400
        });
        this.lastWindow = infowindow;
        infowindow.open(map, marker);
        map.panTo(marker.getPosition());
      });
    });
  }
}

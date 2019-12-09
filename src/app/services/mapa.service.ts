import { Injectable, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { mapStyle } from '../shared/mapStyle';
import { FormControl } from '@angular/forms';
import { OverlayService } from './overlay.service';

declare var google;
declare var MarkerClusterer;

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  lastWindow: any = null;
  markersArray: any[] = [];

  constructor(private geolocation: Geolocation, private overlayService: OverlayService) {}

  async loadMap(mapElement: ElementRef): Promise<any> {
    return await this.geolocation
      .getCurrentPosition()
      .then(resp =>
        this.createMap(
          mapElement.nativeElement,
          new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude),
          15
        )
      )
      .catch(() =>
        this.createMap(mapElement.nativeElement, new google.maps.LatLng(-13.83, -48.02), 4)
      );
  }

  async reloadMap(mapElement: ElementRef, zoom: any, latLng: any) {
    return new Promise(resolve => {
      resolve(this.createMap(mapElement.nativeElement, latLng, zoom));
    });
  }

  private createMap(mapa: any, latLng: any, zoom: any) {
    return new google.maps.Map(mapa, {
      center: latLng,
      zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      panControl: false,
      disableDefaultUI: true,
      styles: mapStyle
    });
  }

  goToMap(map: any, lat: string, lng: string) {
    const center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
    map.setZoom(19);
  }

  addZoomControl(map: any, control: any, zoonIn: any, zoonOut: any) {
    zoonIn.nativeElement.onclick = () => {
      map.setZoom(map.getZoom() + 1);
    };
    zoonOut.nativeElement.onclick = () => {
      map.setZoom(map.getZoom() - 1);
    };
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(control.nativeElement);
  }

  addSearchBox(map: any, input: ElementRef) {
    let searchBox: any;
    try {
      const inputField = input.nativeElement.children[0].children[0];
      searchBox = new google.maps.places.SearchBox(inputField);
    } catch (err) {
      searchBox = new google.maps.places.SearchBox(input.nativeElement);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input.nativeElement);
    }

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
            cidade.setValue(null);
            uf.setValue(null);
            pais.setValue(null);
          }
        } else {
          console.log('Geocoder failed: ' + status);
          cidade.setValue(null);
          uf.setValue(null);
          pais.setValue(null);
        }
      });
    });
  }

  showItens(
    map: any,
    locations: {
      latlng: {};
      id: string;
      title: string;
      descricao: string;
      situacao: string;
      tipo: string;
    }[],
    window: any
  ) {
    const markers = locations.map(location => {
      return new google.maps.Marker({
        position: location.latlng,
        animation: google.maps.Animation.DROP,
        map,
        icon:
          location.situacao === 'Perdido'
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
      this.markersArray.push(marker);
      marker.addListener('click', () => {
        if (this.lastWindow) {
          this.lastWindow.close();
        }
        const infowindow = new google.maps.InfoWindow({
          content:
            '<ion-card class="infomarker">' +
            '<ion-item class="bg-class">' +
            '<ion-avatar slot="start">' +
            '<img src="assets/img/itens/' +
            this.getItemType(locations[i].tipo) +
            '.png">' +
            '</ion-avatar>' +
            '<ion-label>' +
            locations[i].title +
            '</ion-label>' +
            '</ion-item>' +
            '<ion-card-content>' +
            '<ion-note color="danger"><span style="color: #000">Situação: </span>' +
            locations[i].situacao +
            '</ion-note>' +
            '</ion-card-content>' +
            '</ion-card>' +
            '<ion-button onClick="window.ionicPageRef.zone.run(function () { window.ionicPageRef.component.showItemInfo(\'' +
            locations[i].id +
            '\') })"' +
            'expand="block" fill="outline"> Ver Mais </ion-button>',
          maxWidth: 400
        });
        this.lastWindow = infowindow;
        infowindow.open(map, marker);
        map.panTo(infowindow.getPosition());
      });
    });
  }

  getItemType(tipo: any) {
    switch (tipo) {
      case 'Documentos Pessoais':
        return 'documento';
      case 'Animais (Cães e Gatos, Etc)':
        return 'animal';
      case 'Celulares / Smartphones / Etc':
        return 'celular';
      case 'Veículos (Carros, Motos)':
        return 'veiculo';
      case 'Chaves e Chaveiros':
        return 'chave';
      case 'Eletrônicos / Computadores / Tablets, Etc':
        return 'notebook';
      case 'Canetas / Relógio / Joias, Alianças, Cordões, Etc':
        return 'joia';
      case 'Carteiras / Bolsas e Malas':
        return 'bolsa';
      case 'Outros':
        return 'outro';
      case 'Roupas e Calçados':
        return 'roupa';
      case 'Pessoas Desaparecidas':
        return 'pessoa';
    }
  }
}

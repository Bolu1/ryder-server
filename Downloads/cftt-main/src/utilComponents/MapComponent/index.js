import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs,LoadScript, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import CustomAutoComplete from './AutoComplete';

Geocode.setApiKey( 'AIzaSyDCDQGnJO5pIsqILWyDnEZNOAz-LbLgV6g' );
Geocode.enableDebug();

const MapComponent =  (props) => {
	const Map =  withScriptjs(withGoogleMap((prop) =>
	
			<GoogleMap google={ props.google }
					defaultZoom={ props.zoom }
					defaultCenter={{ lat: props.mapPosition.lat, lng: props.mapPosition.lng }}
			>

				<CustomAutoComplete
					onPlaceSelected={ props.onPlaceSelected }
					types={['(regions)']}
				/>

				<InfoWindow
					onClose={props.onInfoWindowClose}
					position={{ lat: ( props.markerPosition.lat + 0.0018 ), lng: props.markerPosition.lng }}
				>
					<div>
						<span style={{ padding: 0, margin: 0 }}>{ props.address }</span>
					</div>
				</InfoWindow>
				{/*Marker*/}
				<Marker google={props.google}
						name={'Dolores park'}
						draggable={true}
						onDragEnd={ props.onMarkerDragEnd }
						position={{ lat: props.markerPosition.lat, lng: props.markerPosition.lng }}
				/>
				<Marker />
				{/* For Auto complete Search Box */}
				
			</GoogleMap>
		))
		

	return(
		<>
		<Map
			googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDCDQGnJO5pIsqILWyDnEZNOAz-LbLgV6g&libraries=places`}
			loadingElement={
				<div style={{ height: `100%` }} />
			}
			containerElement={
				<div style={{ height: props.height }} />
			}
			mapElement={
				<div style={{ height: `100%` }} />
			}
		/>
		</>
	)
}
     
		
			


class Map extends Component{

	constructor( props ){
		super( props );
		this.state = {
			address: '',
			city: '',
			area: '',
			state: '',
			mapPosition: {
				lat: this.props.lat,
				lng: this.props.lng,
			},
			markerPosition: {
				lat: this.props.lat,
				lng: this.props.lng,
			}
		}
	}
	/**
	 * Get the current address from the default map position and set those values in the state
	 */
	componentDidMount() {
		Geocode.fromLatLng( this.state.mapPosition.lat , this.state.mapPosition.lng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components,
				      city = this.getCity( addressArray ),
				      area = this.getArea( addressArray ),
				      state = this.getState( addressArray );

				// console.log( 'city', city, area, state );

				this.setState( {
					address: ( address ) ? address : '',
					area: ( area ) ? area : '',
					city: ( city ) ? city : '',
					state: ( state ) ? state : '',
				} )
			},
			error => {
				console.error( error );
			}
		);
	};
	/**
	 * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
	 *
	 * @param nextProps
	 * @param nextState
	 * @return {boolean}
	 */
	shouldComponentUpdate( nextProps, nextState ){
		if (
			this.state.markerPosition.lat !== this.props.center.lat ||
			this.state.address !== nextState.address ||
			this.state.city !== nextState.city ||
			this.state.area !== nextState.area ||
			this.state.state !== nextState.state
		) {
			return true
		} else if ( this.props.center.lat === nextProps.center.lat ){
			return false
		}
	}
	/**
	 * Get the city and set the city input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getCity = ( addressArray ) => {
    if(addressArray){
      let city = '';
      for( let i = 0; i < addressArray.length; i++ ) {
        if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
          city = addressArray[ i ].long_name;
          return city;
        }
      }
    }
    return null;
	};
	/**
	 * Get the area and set the area input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getArea = ( addressArray ) => {
    if(addressArray){
      let area = '';
      for( let i = 0; i < addressArray.length; i++ ) {
        if ( addressArray[ i ].types[0]  ) {
          for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
            if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
              area = addressArray[ i ].long_name;
              return area;
            }
          }
        }
      }
    }
    return null;
	};
	/**
	 * Get the address and set the address input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getState = ( addressArray ) => {
    if(addressArray){
      let state = '';
      for( let i = 0; i < addressArray.length; i++ ) {
        for( let i = 0; i < addressArray.length; i++ ) {
          if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
            state = addressArray[ i ].long_name;
            return state;
          }
        }
      }
    }
    return null;
	};
	/**
	 * And function for city,state and address input
	 * @param event
	 */
	onChange = ( event ) => {
		this.setState({ [event.target.name]: event.target.value });
	};
	/**
	 * This Event triggers when the marker window is closed
	 *
	 * @param event
	 */
	onInfoWindowClose = ( event ) => {

	};

	/**
	 * When the marker is dragged you get the lat and long using the functions available from event object.
	 * Use geocode to get the address, city, area and state from the lat and lng positions.
	 * And then set those values in the state.
	 *
	 * @param event
	 */
	onMarkerDragEnd = ( event ) => {
	
		const {onMapChange, currentIndex} = this.props;
		let newLat = event.latLng.lat(),
		    newLng = event.latLng.lng();
		
		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components,
				      city = this.getCity( addressArray ),
				      area = this.getArea( addressArray ),
				      state = this.getState( addressArray );
				this.setState( {
					address: ( address ) ? address : '',
					area: ( area ) ? area : '',
					city: ( city ) ? city : '',
					state: ( state ) ? state : '',
					markerPosition: {
						lat: newLat,
						lng: newLng
					},
					mapPosition: {
						lat: newLat,
						lng: newLng
					},
				} )
				onMapChange([newLat, newLng], currentIndex, address);
			},
			error => {
				console.error(error);
			}
		);
	};

	/**
	 * When the user types an address in the search box
	 * @param place
	 */
	onPlaceSelected = ( place ) => {
    
		const {onMapChange, currentIndex} = this.props;
		const address = place.formatted_address,
		      addressArray =  place.address_components,
		      city = this.getCity( addressArray ),
		      area = this.getArea( addressArray ),
		      state = this.getState( addressArray ),
		      latValue = place.geometry.location.lat(),
		      lngValue = place.geometry.location.lng();
		// Set these values in the state.
		// onMapChange([latValue, lngValue], currentIndex);
		onMapChange([latValue, lngValue], currentIndex, address);
		this.setState({
			address: ( address ) ? address : '',
			area: ( area ) ? area : '',
			city: ( city ) ? city : '',
			state: ( state ) ? state : '',
			// markerPosition: {
			// 	lat: latValue,
			// 	lng: lngValue
			// },
			// mapPosition: {
			// 	lat: latValue,
			// 	lng: lngValue
			// },
		})
	};


	render(){
		let markerObj = {lat: this.props.lat, lng: this.props.lng};
		let map;
		if( this.props.center.lat !== undefined ) {
			map = <div>
				<div>
					
						
						Address: <p className="border-0 w-100" >
                            { this.state.address }
                            </p>
					
				</div>
				<MapComponent
					google={this.props.google}
					zoom={this.props.zoom}
					markerPosition={markerObj}
					mapPosition={markerObj}
					onPlaceSelected={(place)=>this.onPlaceSelected(place)}
					onClose={(e)=>this.onInfoWindowClose(e)}
					address={this.state.address}
					height={this.props.height}
					onMarkerDragEnd={this.onMarkerDragEnd}
			/>

				
			</div>
		} else {
			map = <div style={{height: this.props.height}} />
		}
		return( map )
	}
}
export default Map

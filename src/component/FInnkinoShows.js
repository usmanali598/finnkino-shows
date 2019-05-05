import React, { Component } from "react";
import axios from "axios";
import { parseString } from "xml2js";
import moment from "moment";

class FinnkinoShows extends Component {
 state = {
      oneShow: [],
      name: [],
      imags: [],
      showStart: [],
      areaId: "1032", //1013 1021 and 1032 works fine
      text: ""
    };
  componentDidMount() {
    this.getTexts();
  }

ownFunction=()=>{

    var tar = this.refs.one.value;
    if(tar === 'Espoo'){
      this.setState( { areaId: this.refs.typa.value } )
    }
    this.getTexts()

}

  // changeMovies = ( e ) =>
  // {
  //     if ( e.key === 'Enter' )        
  //     {
  //         console.log( this.refs.typa.value )
  //         this.setState( { areaId: this.refs.typa.value } )
  //         this.getTexts()
  //     }
  // }
  getTexts = () => {
    var selfa = this.state.areaId;
    var today = moment().format("DD.MM.YYYY");
    axios
      .get(
        "https://www.finnkino.fi/xml/Schedule/?area=" + selfa + "&dt=" + today
      )
      .then(response => {
        var self = this;

        parseString(response.data, function(err, result) {
          self.setState( {
            name: result.Schedule.Shows[ 0 ].Show.map( items => items.Title ),
            imags: result.Schedule.Shows[ 0 ].Show.map( items => items.Images[ 0 ].EventMediumImagePortrait[ 0 ] ),
            showStart: result.Schedule.Shows[ 0 ].Show.map( items => items.TheatreAuditorium[ 0 ] ),
            oneShow: result.Schedule.Shows[ 0 ].Show,
        } )
        });
      });
  };
  render() {
    var title = this.state.name.map( items => items );
    var imagess = this.state.imags.map( items => items );
    var showTime = this.state.showStart.map( items => items );
    var style = { width: '100%', display:'flex' }
    var styleTitle = { width: '40%',display:'flex', justifyContent: 'center',alignItems: 'center', background: 'black', color: 'gold' }
    var styleTime = { width: '20%', display:'flex', justifyContent: 'center',alignItems: 'center', background: 'black', color: 'gold' }
    var styleSali = { color: 'green', border: '1px solid black' }
    return (
        <div >
            <select name="first" id="one" ref='one' onChange={this.ownFunction}  >
            <option>Select Cinemas</option>
                <option>Espoo</option>
                <option>Espoo:OMENA</option>
                <option>Espoo:SELLO</option>
                <option>Helsinki</option>
                <option>Helsinki:ITIS</option>
                <option>Helsinki:KINOPALATSI</option>
                <option>Helsinki:MAXIM</option>
                <option>Helsinki:TESNISPALATSI</option>
                <option>Vantaa:FLAMINGO</option>
                <option>Jyvaskyla:FANTASIA</option>
                <option>Kuopio:Scala</option>
                <option>Lahti:KUVAPALATSI</option>
                <option>Lappeenranta:STRAND</option>
                <option>Oulu:PLAZA</option>
                <option>Pori:PROMENADI</option>
                <option>Tampere</option>
                <option>Tampere:CINE ATLAS</option>
                <option>Tampere:PLEVNA</option>
                <option>Turku:KINOPALATSI</option>
            </select>
        {/* <input type='text' ref='typa' placeholder="Cinemas areaId & enter" onKeyPress={ this.changeMovies } />
        <p>Type Cinema Id like 1021, 1022 or 1013 or 1032, 1039 and Press Cinema/Enter then Fetch Button </p> */}
        <h1 className="showText">Shows Timing </h1>
        <button className="fetchBtn" onClick={ this.getTexts }>Fetch</button>
                { this.state.oneShow.map( ( items, i ) => <div key={ i } style={ style } >
                    <div  style={ styleTime }>{ items.dttmShowStartUTC.map( ls => ls.substring( 11, 16 ) ) }</div>
                    <div  style={ styleTitle }>{ items.Title } </div>
                    <div > <img src={ items.Images ? items.Images[ 0 ].EventMediumImagePortrait[ 0 ] : '' } height="200px" width="150px" /></div>
                    {console.log(items.TheatreAndAuditorium)}
                    <div  style={ styleTitle } >
                   <ul style={{listStyle:'none'}}>
                       <li>{ items.TheatreAndAuditorium.toString().split( ',' ) }</li>
                       {/* <li>{ items.TheatreAndAuditorium.toString().split( ',' )[1] } </li>
                       <li> { items.TheatreAndAuditorium.toString().split( ',' )[2] }</li> */}
                   </ul>
                   </div>
                </div> ) }
    </div >
    );
  }
}

export default FinnkinoShows;
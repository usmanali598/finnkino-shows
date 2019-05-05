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
    var style = { width: '1080px' }
    var styleTitle = { width: '40%' }
    var styleTime = { width: '20%' }
    var styleSali = { color: 'green', border: '1px solid black' }
    return (
        <div style={ style }>
        <input type='text' ref='typa' placeholder="Cinemas areaId & enter" onKeyPress={ this.changeMovies } />
        <p>Type Cinema Id like 1021, 1022 or 1013 or 1032, 1039 and Press Cinema/Enter then Fetch Button </p>
        <h1 className="showText">Shows Timing </h1>
        <button className="fetchBtn" onClick={ this.getTexts }>Fetch</button>
        <table className="table">
            <tbody>
                { this.state.oneShow.map( ( items, i ) => <tr key={ i } style={ style } className="table">
                    <td className="table" style={ styleTime }>{ items.dttmShowStartUTC.map( ls => ls.substring( 11, 16 ) ) }</td>
                    <td > <img src={ items.Images[ 0 ].EventMediumImagePortrait[ 0 ] } height="200px" width="150px" /></td>
                    <td className="styleTitle" style={ styleTitle }>{ items.Title } </td>
                    <td className="table" >{ items.TheatreAndAuditorium.toString().split( ',' ) }</td>
                </tr> ) }
            </tbody>
        </table>
    </div >
    );
  }
}

export default FinnkinoShows;
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

  ownFunction = () => {
    var cinema = this.refs.one.value;
    var newAreaId = "";
    switch (cinema) {
      case "Espoo":
        newAreaId = 1012;
        break;
      case "Espoo:OMENA":
        newAreaId = 1039;
        break;
      case "Espoo:SELLO":
        newAreaId = 1038;
        break;
      case "Helsinki":
        newAreaId = 1002;
        break;
      case "Helsinki:ITIS":
        newAreaId = 1045;
        break;
      case "Helsinki:KINOPALATSI":
        newAreaId = 1031;
        break;
      case "Helsinki:MAXIM":
        newAreaId = 1032;
        break;
      case "Helsinki:TESNISPALATSI":
        newAreaId = 1033;
        break;
      case "Vantaa:FLAMINGO":
        newAreaId = 1013;
        break;
      case "Jyvaskyla:FANTASIA":
        newAreaId = 1015;
        break;
      case "Kuopio:SCALA":
        newAreaId = 1016;
        break;
      case "Lahti:KUVAPALATSI":
        newAreaId = 1017;
        break;
      case "Lappeenranta:STRAND":
        newAreaId = 1041;
        break;
      case "Oulu:PLAZA":
        newAreaId = 1018;
        break;
      case "Pori:PROMENADI":
        newAreaId = 1019;
        break;
      case "Tampere":
        newAreaId = 1021;
        break;
      case "Tampere:CINE ATLAS":
        newAreaId = 1034;
        break;
      case "Tampere:PLEVNA":
        newAreaId = 1035;
        break;
      case "Turku:KINOPALATSI":
        newAreaId = 1022;
        break;
      case "Select Cinemas":
        newAreaId = 1032;
        break;
    }

    this.setState({ areaId: newAreaId });
    // this.getTexts();
  };
  getTexts = () => {
    var { areaId } = this.state;
    var today = moment().format("DD.MM.YYYY");
    axios
      .get(
        "https://www.finnkino.fi/xml/Schedule/?area=" + areaId + "&dt=" + today
      )
      .then(response => {
        var self = this;

        parseString(response.data, function(err, result) {
          self.setState({
            name: result.Schedule.Shows[0].Show.map(items => items.Title),
            imags: result.Schedule.Shows[0].Show.map(
              items => items.Images[0].EventMediumImagePortrait[0]
            ),
            showStart: result.Schedule.Shows[0].Show.map(
              items => items.TheatreAuditorium[0]
            ),
            oneShow: result.Schedule.Shows[0].Show
          });
        });
      });
  };
  render() {
    var style = { width: "100%", display: "flex" };
    var styleTitle = {
      width: "40%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "black",
      color: "gold",
      border: "1px solid",
      fontSize: '23px'
    };
    var styleTime = {
      width: "20%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "black",
      color: "gold",
      border: "1px solid",
      fontSize: '23px'
    };
    return (
      <div>
        <select className='select animated zoomIn' name="first" id="one" ref="one" onChange={this.ownFunction}>
          <option disabled="disabled">Select Cinemas</option>
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
          <option>Kuopio:SCALA</option>
          <option>Lahti:KUVAPALATSI</option>
          <option>Lappeenranta:STRAND</option>
          <option>Oulu:PLAZA</option>
          <option>Pori:PROMENADI</option>
          <option>Tampere</option>
          <option>Tampere:CINE ATLAS</option>
          <option>Tampere:PLEVNA</option>
          <option>Turku:KINOPALATSI</option>
        </select>
        <h1 className="showText">Shows Timing </h1>
        <button className="fetchBtn" onClick={this.getTexts}>
          Fetch
        </button>
        {this.state.oneShow.map((items, i) => (
          <div key={i} style={style}>
            <div style={styleTime}>
              {items.dttmShowStartUTC.map(ls => ls.substring(11, 16))}
            </div>
            <div style={styleTitle}>{items.Title} </div>
            <div>
              {" "}
              <img
                src={
                  items.Images
                    ? items.Images[0].EventMediumImagePortrait[0]
                    : ""
                }
                height="200px"
                width="150px"
              />
            </div>
            <div style={styleTitle}>
              <ul style={{ listStyle: "none" }}>
                {items.TheatreAndAuditorium.toString().split(",").length ==
                3 ? (
                  <span>
                    <li>
                      {items.TheatreAndAuditorium.toString().split(",")[0]}
                    </li>
                    <li>
                      {items.TheatreAndAuditorium.toString().split(",")[1]}
                    </li>
                    <li>
                      {items.TheatreAndAuditorium.toString().split(",")[2]}
                    </li>
                  </span>
                ) : (
                  <li>{items.TheatreAndAuditorium.toString().split(",")}</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default FinnkinoShows;

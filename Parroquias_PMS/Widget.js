///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define(['dojo/_base/declare', 'jimu/BaseWidget',"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/lang", "esri/layers/FeatureLayer", "esri/geometry/Extent", "esri/SpatialReference","esri/graphic","esri/Color","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleFillSymbol"],
  function(declare, BaseWidget, Query, QueryTask, lang, FeatureLayer, Extent, SpatialReference, Graphic, Color, SimpleLineSymbol, SimpleFillSymbol) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-parroquias',

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      postCreate: function() {
        console.log('postCreate');
        this.map.setExtent(new Extent({   xmin: -1395165.1610623163,
          ymin: 5062608.897781243,
          xmax: -455906.9574941171,
          ymax: 5499217.203346147,
          spatialReference: {
             wkid: 102100
          }}))

      },

      startup: function() {
       console.log('startup');
      },

      onOpen: function(){
        console.log('onOpen');
      },

      onClose: function(){
        console.log('onClose');
      },

      onMinimize: function(){
        console.log('onMinimize');
      },

      onMaximize: function(){
        console.log('onMaximize');
      },



      cargaConcellos: function(){
        
        var codigoProvincia = this.selectProvincia.value;
        console.log(codigoProvincia)
        if(codigoProvincia == -1){
          this.listaConcellos.innerHTML = ""
          this.concellos.style.display = "none"
          this.parroquias.style.display = "none"
        }
        else{
          this.listaConcellos.innerHTML = ""
          this.listaParroquias.innerHTML = ""

          var queryTask = new QueryTask(this.config.capaConcellos)

          var query = new Query()

          query.returnGeometry = false;
          query.outFields = ["CODPROV","CODCONC", "CONCELLO"]
          query.where = "CODPROV = '" + codigoProvincia + "'";

          queryTask.execute(query,lang.hitch(this, function(results){
            console.log(results)
            for(var concello of results.features){

              opt = document.createElement("option")
              opt.value = concello.attributes.CODCONC;
              opt.innerHTML = concello.attributes.CONCELLO;
              this.listaConcellos.add(opt)
            }
            this.concellos.style.display = "block"
          }))         
        }

      },



      cargaParroquias: function(){

        var codigoConcello = this.listaConcellos.value;
        console.log(codigoConcello)
        if(codigoConcello == -1){
          this.listaParroquias.innerHTML = ""
          this.parroquias.style.display = "none"
        }
        else{
          this.listaParroquias.innerHTML = ""
          var queryTask = new QueryTask(this.config.capaParroquias)

          var query = new Query()

          query.returnGeometry = false;
          query.outFields = ["CODCONC", "PARROQUIA", "CODPARRO"]
          query.where = "CODCONC = '" + codigoConcello + "'";

          queryTask.execute(query,lang.hitch(this, function(results){
            console.log(results)
            for(var parroquia of results.features){

              opt = document.createElement("option")
              opt.value = parroquia.attributes.CODPARRO;
              opt.innerHTML = parroquia.attributes.PARROQUIA;
              this.listaParroquias.add(opt)
            }
            this.parroquias.style.display = "block"
          })) 
        }

      },


      zoomConcello: function(){
        var codigoProvincia = this.selectProvincia.value;
        console.log(codigoProvincia)
        if(codigoProvincia == -1){
          console.log('No se realizan acciones')
        }

        else{

          var codigoConcello = this.listaConcellos.value

          var queryTask = new QueryTask(this.config.capaConcellos)

          var query = new Query()

          query.returnGeometry = true;
          query.outFields = ["CODPROV","CODCONC", "CONCELLO"]
          query.where = "CODCONC = '" + codigoConcello + "'";
          query.outSpatialReference = new SpatialReference(102100)

          queryTask.execute(query, lang.hitch(this, function(results){
            console.log(results)
            if(results.features.length > 0){
              var geometria = results.features[0].geometry
              this.map.graphics.clear()

              //Definimos el simbolo
              var line = new SimpleLineSymbol();
              line.setColor(new Color([71, 71, 71, 1]));
              var fill = new SimpleFillSymbol();
              fill.setColor(new Color([92, 92, 92, 0.69]));
              fill.setOutline(line);

              this.map.graphics.add(new Graphic(geometria, fill))

              this.map.setExtent(geometria.getExtent(), true);

            }
          }))



        }


      },

      zoomParroquia: function(){
        console.log(this.map)

        var codigoProvincia = this.selectProvincia.value;
        console.log(codigoProvincia)
        if(codigoProvincia == -1){
          console.log('No se realizan acciones')
        }

        else{

          var codigoParroquia = this.listaParroquias.value

          var queryTask = new QueryTask(this.config.capaParroquias)

          var query = new Query()

          query.returnGeometry = true;
          query.outFields = ["CODCONC", "PARROQUIA", "CODPARRO"]
          query.where = "CODPARRO = '" + codigoParroquia + "'";
          query.outSpatialReference = new SpatialReference(102100)

          queryTask.execute(query, lang.hitch(this, function(results){
            console.log(results)
            if(results.features.length > 0){
              var geometria = results.features[0].geometry
              this.map.graphics.clear()

              //Definimos el simbolo
              var line = new SimpleLineSymbol();
              line.setColor(new Color([71, 71, 71, 1]));
              var fill = new SimpleFillSymbol();
              fill.setColor(new Color([92, 92, 92, 0.69]));
              fill.setOutline(line);

              this.map.graphics.add(new Graphic(geometria, fill))

              this.map.setExtent(geometria.getExtent(), true);

            }
          }))



        }

      }


      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });
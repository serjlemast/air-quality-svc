'use strict';

app.component('sensors', {
    controller: function ($location, $scope, restService) {

        $scope.sensors = [];

        $scope.tvocColors = ["rgb(167,159,192)"];
        $scope.eco2Colors = ["rgb(139,173,241)"];
        $scope.temperatureColors = ["rgb(180,180,180)"];
        $scope.humidityColors = ["rgb(95,143,164)"];

        restService.get('/sensors').then(function (response) {
            $scope.sensors = response.data.map(sensor => {
                let tempData = sensor.data.find(d => d.key === "temperature_celsius");
                let humidityData = sensor.data.find(d => d.key === "humidity");
                let tvocData = sensor.data.find(d => d.key === "tvoc");
                let eco2Data = sensor.data.find(d => d.key === "eco2");

                return {
                    ...sensor,
                    temperatureLabels: tempData ? tempData.dates.map(d => new Date(d).toLocaleTimeString()) : [],
                    temperatureData: tempData ? [tempData.values] : [[]],
                    temperatureSeries: 'Temperature (°C)',

                    humidityLabels: humidityData ? humidityData.dates.map(d => new Date(d).toLocaleTimeString()) : [],
                    humidityData: humidityData ? [humidityData.values] : [[]],
                    humiditySeries: 'Humidity (%)',

                    tvocLabels: tvocData ? tvocData.dates.map(d => new Date(d).toLocaleTimeString()) : [],
                    tvocData: tvocData ? [tvocData.values] : [[]],
                    tvocSeries: 'TVOC (ppb)',

                    eco2Labels: eco2Data ? eco2Data.dates.map(d => new Date(d).toLocaleTimeString()) : [],
                    eco2Data: eco2Data ? [eco2Data.values] : [[]],
                    eco2Series: 'eCO₂ (ppm)'
                };
            });
        });

    }, template: `
<div class="container">
   <div class="row" style="padding-top: 40px;padding-bottom: 40px">
      <div class="col-12">
         <div class="card text-center">
            <div class="card-header">
               Sensors
               <br>
            </div>
            <div class="card-body">
               <div ng-repeat="sensor in sensors track by $index">
                  <h5>{{ sensor.deviceId }} ({{ sensor.type }})</h5>
                  <div ng-if="sensor.type !== 'CCS811'">
                     <div class="row">
                        <div class="col-12 col-md-6">
                           {{sensor.temperatureSeries}}
                           <canvas 
                              class="chart chart-line" 
                              chart-data="sensor.temperatureData" 
                              chart-labels="sensor.temperatureLabels"
                              chart-colors="temperatureColors">
                           </canvas>
                        </div>
                        <div class="col-12 col-md-6">
                           {{sensor.humiditySeries}}
                           <canvas 
                              class="chart chart-line" 
                              chart-data="sensor.humidityData" 
                              chart-labels="sensor.humidityLabels"
                              chart-colors="humidityColors">
                           </canvas>
                        </div>
                     </div>
                  </div>
                  <div ng-if="sensor.type === 'CCS811'">
                     <div class="row">
                         <div class="col-12 col-md-6">
                           {{sensor.eco2Series}}
                           <canvas 
                              class="chart chart-line" 
                              chart-data="sensor.eco2Data" 
                              chart-labels="sensor.eco2Labels"
                              chart-colors="eco2Colors">
                           </canvas>
                        </div>
                        <div class="col-12 col-md-6">
                           {{sensor.tvocSeries}}
                           <canvas 
                              class="chart chart-line" 
                              chart-data="sensor.tvocData" 
                              chart-labels="sensor.tvocLabels"
                              chart-colors="tvocColors">
                           </canvas>
                        </div> 
                     </div>
                  </div>
                  <br>
                  <br>
               </div>
            </div>
            <div class="card-footer text-muted"><br></div>
         </div>
      </div>
   </div>
</div>
`
});
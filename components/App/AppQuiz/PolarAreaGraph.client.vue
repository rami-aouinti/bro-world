<template>
    <VueApexCharts height=300, type="area" :options="options" :series="series"></VueApexCharts>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts";

const { data: labNumbers } = await useAsyncData("quizz/annilab", () =>
    queryContent("/quizz/annilab").find()
  );

const generateDateTimeSerie = (timeSerie) => {
  var series = [];
  timeSerie.forEach(function (e) {
    series.push([new Date(e[0]).getTime(), e[1]]);
  });
  return series
}

    const options = {
        chart: {
          id: 'vuechart-example',
          stacked: true,
        },
        colors: ['#008FFB', '#00E396', '#CED4DC'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          }
        },
        legend: {
          labels: {colors:  'white'},
          position: 'top',
          horizontalAlign: 'left',
          style: {
              color:  'white !important'
        },
        },
        xaxis: {
          type: 'datetime',
          labels:{
            style: {
              colors: 'white'
            }
          }
        },
        yaxis: {
          labels:{
            style: {
              colors: 'white'
            }
          }
        },
        title: {
              text: "Temps d'occupation (en heures) du Lab en 2023, par catégories",
              align: 'left',
              offsetX: 14,
              style: {
              color:  'white'
              },
            },
      }

     const series = [{
            name: 'Formations',
            data: generateDateTimeSerie(labNumbers.value[0].timeline.formas)
          },
          {
            name: 'Projets',
            data: generateDateTimeSerie(labNumbers.value[0].timeline.projets)
          },
          {
            name: 'Evénements',
            data: generateDateTimeSerie(labNumbers.value[0].timeline.events)
          }]
</script>

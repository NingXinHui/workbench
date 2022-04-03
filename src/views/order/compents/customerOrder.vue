<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme

export default {
  mixins: [],
  props: {
    className: {
      type: String,
      default: "chartone",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "230px",
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: {
          type: "value",
          show: false,
          boundaryGap: ["5%", "5%"],
        },
        yAxis: {
          type: "category", //增加这一行代码，即可柱状图横置
          data: ["客户一", "客户二", "客户三", "客户四", "客户五"],
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: "#97A0C3",
              fontSize: "12",
              itemSize: "",
            },
          },
          //   max: 6,
        },
        grid: {
          show: false,
          bottom: 60,
          x: 80,
          x2: 40,
          y: 0,
        },

        series: [
          {
            data: [ 70,80,150,200,240],
            type: "bar",
            barWidth: "20",
            color: "#0080FF",
            label: {
              show: true,
              color:'#242F57',
              formatter: "{c}w", //显示数据带上百分比
              position: "right", //控制数据显示位置，‘’right‘’为显示在柱状图右侧
            },
          },
        ],
      });
    },
  },
};
</script>

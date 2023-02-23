import moment from "moment";
import React from "react";
import Chart from "react-apexcharts";

class TotalRevenue extends React.Component {
  state = {
    searchData: {
      endDate: null,
      startDate: null,
    },
    isLoading: false,

    options: {
      chart: {
        height: 350,
        width: 200,
        id: "Total Revenue",
      },
      dataLabels: {
        enabled: false,
      },
    },
  };

  render() {
    // @ts-ignore
    const series = [
      {
        data: [
          {
            x: "Donations",
            // @ts-ignore
            y:
              // @ts-ignore
              this.props.convertedAmount === 0
                ? // @ts-ignore
                  this.props.data.totalDonations
                : // @ts-ignore
                  this.props.convertedAmount,
          },
          {
            x: "Offerings",
            // @ts-ignore
            y: this.props.data.totalOfferings,
          },
          {
            x: "Welfare",
            // @ts-ignore
            y: this.props.data.totalWelfare,
          },
        ],
      },
    ];

    return (
      <div id="chart" className="bg-white">
        {/* @ts-ignore */}
        {this.props?.date?.startDate && (
          <>
            {/* @ts-ignore */}
            <h6 className="mt-3">
              Amount generated from {/* @ts-ignore */}
              {moment(this.props?.date?.startDate).format("DD-MM-YYYY")}
              {/* @ts-ignore */}
              {this.props?.date?.endDate && (
                <>
                  {/* @ts-ignore */} to{" "}
                  {moment(this.props?.date?.endDate).format("DD-MM-YYYY")}{" "}
                </>
              )}{" "}
            </h6>
          </>
        )}

        <Chart
          options={this.state.options}
          series={series}
          type="bar"
          height={400}
        />
      </div>
    );
  }
}
export default TotalRevenue;

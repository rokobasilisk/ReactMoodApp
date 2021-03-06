import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { AverageMoodDisplay } from './average-mood';
import { Doughnut, Bar } from 'react-chartjs-2';
import { RestService } from '../../services/rest-service';
import { InsightsHistory } from './insights-history';
import { DateFilter } from './date-filter';
import Typography from '@material-ui/core/Typography';

export class Insights extends React.Component {
    state = {
        userData: [],
        averageMood: 0,
        donutData: {
            datasets: [{
                data: [1, 1],
                backgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                ]
            }],
            labels: [
                'Negative',
                'Positive',
            ]
        }
    };

    componentDidMount() {
        this.refresh();
        this.props.setRefresh(this.refresh);
    }

    refresh = () => {
        RestService.getAllDataForUser(1, (data) => this.updateStateAndData(data));
    }

    refreshWithDateFilter = (fromDate, toDate) => {
        RestService.getFilteredDataByDateForUser(1, fromDate, toDate, (data) => this.updateStateAndData(data))
    }

    updateStateAndData(data) {
        this.setState({ userData: data.userData }, () => {
            this.calculateAndSetMoodState();
        });
    }

    calculateAndSetMoodState() {
        let moodSum = 0;
        let moodCount = 0;

        this.state.userData.forEach(item => {
            moodSum = moodSum + +item.mood;
            moodCount++;
        });

        const averageMood = (moodSum / moodCount);

        this.setState({
            averageMood: averageMood,
            donutData: {
                datasets: [{
                    data: [
                        Math.round(averageMood),
                        Math.round(6 - averageMood)
                    ],
                    backgroundColor: [
                        '#ff6384',
                        '#36a2eb',
                    ]
                }],
                labels: [
                    'Negative',
                    'Positive',
                ]
            }
        });
    }

    render() {
        return (
            <div>
            {   
                this.state.userData.length > 0 && 
                <div>
                    <Typography gutterBottom variant="headline" component="h2">
                        Check in summary:
                    </Typography>
                    <ExpansionPanel expanded>
                        <ExpansionPanelSummary>
                            <AverageMoodDisplay averageMood={this.state.averageMood} />
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                <Doughnut data={this.state.donutData} />
                            </div>
                            <br />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Typography gutterBottom variant="headline" component="h2">
                        Review your previous {this.state.userData.length} checkins:
                    </Typography>
                    <DateFilter filterCallback={this.refreshWithDateFilter}/>
                    <InsightsHistory data={this.state.userData} />
                </div>
            }
            {
                this.state.userData.length === 0 &&
                <Typography 
                    style={{margin: "12px"}}
                    component="h2">
                    Please start by checking in data using the 'Add' button top right.
                </Typography>
            }
            </div>
        );
    }
}
export default Insights;
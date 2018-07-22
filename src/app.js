import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';
import Button from '@material-ui/core/Button';
import { CheckInDialog } from './components/check-in/check-in-dialog';
import { Insights } from './components/insights/insights';

export class App extends React.Component {
    state = {
        addDialog: false,
    };

    theme = createMuiTheme({
        palette: {
            primary: blue,
            secondary: pink,
        },
    });

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MuiThemeProvider theme={this.theme}>
                <div className="container">
                    <CssBaseline />
                    <AppBar position="static"
                        color="primary">
                        <Toolbar>
                            <Typography variant="title"
                                color="inherit"
                                style={{ flexGrow: 1 }}>
                                React Mood Picker App
                            </Typography>
                            <Button color="inherit" onClick={() => this.clickToggle()}>
                                Add
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <br/>
                    <br/>
                    <CheckInDialog setDialogToggle={click => this.clickToggle = click}/>
                    <Insights/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
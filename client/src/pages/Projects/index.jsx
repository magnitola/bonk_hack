import React, { useContext, useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {useHttp} from '../../hooks/http.hook';
import {AuthContext} from '../../context/AuthContext';
import List from '../../components/List';
import Modal from './../../components/Modal';
import ProjectCard from './../../pages/cards/Project';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Dialog from './../../components/Dialog';

import './index.css';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 1300,
    },
    spinnerWrapper: {
        display: 'flex',
        justifyContent: "center",
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    spinner: {
        marginTop: 17
    },
    projectWrapper: {
        display: 'flex'
    },
    addProject: {
        width: 182,
        height: 74,
        fontSize: 16,
        marginLeft: 300
    },
    formCreate: {
        flexDirection: 'column'
    }
  }));

const Projects = () => {
    const [value, setValue] = useState(0);
    const auth = useContext(AuthContext);
    const {request, loading} = useHttp();
    const classes = useStyles();
    const [listItems, setList] = useState([]);
    const [projectOpen, setProjectOpen] = useState(false);
    const [curProject, setCurProject] = useState(null);
    const [opening, setOpening] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const closeDialog = () => {
        setOpenDialog(false);

        request(`/api/project/create`, 'POST', createForm);
    };
    const [mentors, setMentors] = useState([]);
    const [createForm, updateCreateProjectForm] = useState({
        name: '',
        documents: '',
        author: '',
        mentor: ''
    });

    const changeCreateFormHandler = event => {
		updateCreateProjectForm({ ...createForm, [event.target.name]: event.target.value })
	};

    const getItemsByRole = () => {
        const permissions = {
            "Student": ['Заявки', 'Выполнение', 'На проверке', 'Архив'],
            "Project manager": ['Новые проекты', 'На выполнении', 'Внешние проекты', 'Архив'],
            "Mentor": ['На проверке', 'Архив']
        };

        return permissions[auth.role];
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getProjects = async () => {
        const data = await request(`/api/projects`, 'POST', {
            status: value,
            userId: auth.userId
        });
        setList(data);
    };

    useEffect(() => {
        getProjects();
    }, [value]);


    const openProjectModal = async (project) => {
        setOpening(true);
        const data = await request(`/api/project`, 'POST', {
            id: project.id,
        });
        setOpening(false);

        setCurProject(data);
        setProjectOpen(true);
    }

    const closeProjectModal = () => {
        setCurProject(null);
        setProjectOpen(false);
    }


    const createProject = async () => {
        const data = await request(`/api/profile/get/mentors`, 'POST', {});
        setMentors(data);
        setOpenDialog(true);
    }

    return (
        <div className={classes.root}>
            <div className={classes.projectWrapper}>
                <div>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="scrollable force tabs example"
                    >
                        {
                            getItemsByRole().map((item, index) => {
                                return (
                                    <Tab key={index} label={item} icon={<PhoneIcon />} {...a11yProps(index)} />            
                                )
                            })
                        }
                    </Tabs>
                </AppBar>
                
                {
                    loading ?
                    <div className={classes.spinnerWrapper}>
                        <CircularProgress className={classes.spinner}/>
                    </div>
                    :
                    getItemsByRole().map((item, index) => {
                        return (
                            <TabPanel value={value} index={index} key={index}>
                                <List {...{ items: listItems, onItemClick: openProjectModal}}/>
                            </TabPanel>
                        );
                    })
                }
                </div>

                {
                    auth.role === 'Project manager' ?
                    <Button variant="contained" color="primary" className={classes.addProject} onClick={createProject}>
                        Создать проект
                    </Button> : <></>
                }
            </div>
        {
            curProject &&
            <Modal {...{ open: projectOpen, close: closeProjectModal }}>
                <ProjectCard project={curProject} />
            </Modal>
        }

        <Dialog {...{
            open: openDialog,
            close: closeDialog,
            title: 'Создание проекта',
            titleAction: 'Создать'
        }}>
            <form className={classes.formCreate} noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Название проекта" variant="outlined" onChange={changeCreateFormHandler}/>
                <TextField id="outlined-basic" label="Документы" variant="outlined" onChange={changeCreateFormHandler}/>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-helper-label">{createForm.mentor || 'Age'}</InputLabel>
                    <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={createForm.mentor}
                    onChange={changeCreateFormHandler}
                    >
                    {
                        mentors.map((item, index) => <MenuItem value={item.id} key={index}>{`${item.surname} ${item.name} ${item.second_name}`}</MenuItem>)
                    }
                    </Select>
                    <FormHelperText>Выберите наставника проекта</FormHelperText>
                </FormControl>
            </form>
        </Dialog>
        </div>
    )
};

export default Projects;
const express = require('express');

const app = express();
let projects = [];
let count = 0;

app.use(express.json());

app.use((req, res, next) =>{
    count++;
    console.log(`Number of access: ${count}`);

    return next();
});

function projectExists(req, res, next) {
    const {id} = req.params;
    const project = projects.find(prjt => prjt.id === id);

    if(!project) { 
        return res.status(400).json({ error: "Project does not exist" });
    }

    return next();
}

app.get('/projects', (req, res) => {
    return res.json({projects});
});

app.get('/projects/:id', projectExists,(req, res) => {
    const id = req.params.id;
    const project = projects.filter(prjt => prjt.id === id);

    return res.json(project);
});

app.delete('/projects/:id', projectExists, (req, res) => {
    const id = req.params.id;
    const index = projects.findIndex(prjt => prjt.id === id );

    projects.splice(index, 1);

    return res.send();
});

app.post('/projects', (req, res) => {
    const {id, title} = req.body;
    projects.push({ id, title, tasks: [] });

    return res.json(projects);
});

app.post('/projects/:id/tasks', projectExists,(req, res) => {
    const {id} = req.params;
    const {title} = req.body;

    const [project] = projects.filter(prj => prj.id == id);
    project.tasks.push(title);

    return res.json(project);
});

app.put('/projects/:id', projectExists,(req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    const index = projects.findIndex(prjt => prjt.id === id );
    projects[index].title = title;

    return res.json(projects[index]);
});

app.listen(3000);

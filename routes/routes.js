const express = require('express');
const router = express.Router();

const userController = require('./users/UserController')
const groupController = require('./groups/GroupController')
const fieldController = require('./fields/FieldController')
const scheduleController = require('./schedules/ScheduleController')
const rotationController = require('./rotations/RotationController')
const assignmentController = require('./assignments/AssignmentController')
const requestController = require('./requests/RequestController')

router.post('/login', userController.login);

//Users
router.get('/users', userController.listUsers);
router.get('/users/med-admins', userController.listMedAdmins);
router.get('/users/med-admins/:id', userController.getMedAdmin);
router.get('/users/field-admins', userController.listFieldAdmins);
router.get('/users/field-admins/:id', userController.getFieldAdmin);
router.get('/users/students', userController.listStudents);
router.get('/users/students/unassigned', userController.listUnassignedStudents);
router.get('/users/students/:id', userController.getStudent);
router.put('/users/students/:id', userController.updateStudent);
router.put('/users/profile/update/:id', userController.updateUserProfile);
router.get('/users/:id', userController.getUser);

router.put('/users/:id', userController.updateUser);

router.post('/users', userController.createUser);

//Groups
router.get('/groups', groupController.listGroups);
router.get('/groups/:id', groupController.getGroup);
router.post('/groups', groupController.createGroup);
router.post('/groups/addStudent', groupController.addStudentToGroup);
router.post('/groups/default/create', groupController.createDefaultGroups);

//Fields
router.get('/fields', fieldController.listFields);
router.get('/fields/:id', fieldController.getField);
router.post('/fields', fieldController.createField);
router.put('/fields/:id', fieldController.updateField);

//FieldGroups
router.get('/field-groups', fieldController.listFieldGroups);
router.post('/field-groups', fieldController.createFieldGroup);
router.put('/field-groups/:id', fieldController.updateFieldGroup);

//Schedules
router.get('/schedules', scheduleController.listSchedules);
router.post('/schedules', scheduleController.createSchedule);
router.put('/schedules/:id', scheduleController.updateSchedule);

//Rotations
router.post('/rotations', rotationController.createRotation);
router.get('/rotations', rotationController.listRotations);
router.get('/rotations/:id', rotationController.getRotation);
router.post('/rotations/lookup', rotationController.rotationLookup);

//Assignments
router.get('/assignments', assignmentController.listAssignments);
router.post('/assignments', assignmentController.createAssignment);
router.put('/assignments/:id', assignmentController.updateAssignment);
router.get('/assignments/:id', assignmentController.getAssignment);
router.get('/assignments/students/:id', assignmentController.listAssignmentsByStudent);
router.get('/assignments/rotations/:id', assignmentController.listAssignmentsByRotation);
router.get('/assignments/field-admin/:id', assignmentController.listAssignmentsByFieldAdmin);
router.post('/assignments/switch', assignmentController.switchAssignments);

//Requests
router.post('/requests', requestController.createRequest);
router.get('/requests/switch', requestController.listSwitchRequests);
router.get('/requests/elective', requestController.listElectiveRequests);
router.post('/requests/elective/approve', requestController.approveElectiveRequest);

module.exports = router;
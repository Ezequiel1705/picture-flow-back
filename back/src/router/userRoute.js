import { getUsers, getUser, updateUser, deleteUser, savePin, getSavedByUser, deleteSavedByUser } from '../controller/usercontroller.js';
import express from 'express';
const router = express.Router();


router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser)

router.post('/saves/:userId', savePin)
router.get('/saves/:userId', getSavedByUser)
router.delete('/saves/:userId/:saveId', deleteSavedByUser)


export default router;

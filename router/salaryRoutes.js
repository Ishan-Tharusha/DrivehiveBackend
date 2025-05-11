import express from 'express';
import { addSalary, getSalaries, getSalaryById, updateSalary, deleteSalary,getUsersWithoutSalary } from '../controller/salaryController.js';

const router = express.Router();
router.get('/users-without-salary', getUsersWithoutSalary);
router.post('/', addSalary);
router.get('/', getSalaries);
router.get('/:id', getSalaryById);
router.put('/:id', updateSalary);
router.delete('/:id', deleteSalary);
export default router;

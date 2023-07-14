import { Router } from "express";
import {createData, loginData,getData,getDataID, updateData, deletedata, checkTokenData, userProfile} from './controller'

const router = Router()

router.post('/noname/create-users', createData)
router.get('/noname/all', getData)
router.get('/noname/:_id', checkTokenData, getDataID)
router.get('/noname/profile/me', checkTokenData, userProfile)
router.post('/noname/login', loginData)


export default router 
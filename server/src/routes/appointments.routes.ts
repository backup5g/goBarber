import { Router } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import AppointmentsRepository from '../repositories/Appointments'
import CreateAppointment from '../services/CreateAppointment'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const router = Router()

router.use(ensureAuthenticated)

router.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentsRepository)

  const appointments = await repository.find()

  return response.json(appointments)
})

router.post('/', async (request, response) => {
  const { provider_id, date } = request.body

  const parsedDate = parseISO(date)

  const createAppointment = new CreateAppointment()

  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate,
  })

  return response.json(appointment)
})

export default router

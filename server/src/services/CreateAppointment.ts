import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/Appointments'

import AppError from '../errors/AppError'

interface Request {
  provider_id: string
  date: Date
}

class CreateAppointment {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentsRepository)

    const appointmentDate = startOfHour(date)

    const findAppointmentInSameDate = await repository.findByDate(
      appointmentDate,
    )

    if (findAppointmentInSameDate) {
      throw new AppError('The appointment is already booked')
    }

    const appointment = repository.create({
      provider_id,
      date: appointmentDate,
    })

    await repository.save(appointment)

    return appointment
  }
}

export default CreateAppointment

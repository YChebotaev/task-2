import { makeAutoObservable } from "mobx";
import type { UserProfile as UserProfileType } from "@task-2/service/types";

export class UserProfileForm implements UserProfileType {
  id: number
  bio: string
  firstName: string
  lastName: string
  dateOfBirth: number
  country: string
  city: string

  constructor(profile: UserProfileType) {
    this.id = profile.id
    this.bio = profile.bio
    this.firstName = profile.firstName
    this.lastName = profile.lastName
    this.dateOfBirth = profile.dateOfBirth
    this.country = profile.country
    this.city = profile.city

    makeAutoObservable(this);
  }

  setBio(bio: string) {
    this.bio = bio
  }

  setFirstName(firstName: string) {
    this.firstName = firstName
  }

  setLastName(lastName: string) {
    this.lastName = lastName
  }

  setDateOfBirth(dateOfBirth: Date | undefined) {
    if (dateOfBirth) {
      this.dateOfBirth = dateOfBirth.getTime()
    }
  }

  setCountry(country: string) {
    this.country = country
  }

  setCity(city: string) {
    this.city = city
  }

  isEmpty() {
    return [
      this.bio,
      this.firstName,
      this.lastName,
      this.dateOfBirth,
      this.country,
      this.city
    ].every((v) => !v)
  }
}

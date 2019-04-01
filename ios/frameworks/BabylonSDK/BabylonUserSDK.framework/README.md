## User SDK
`BabylonUserSDK` provides means to access and update the patient information associated with the given Babylon user.

Note that only the patient information of the user, or any associated users, can be accessed by the User SDK.

1. [Instantiate the User SDK](#instantiate-the-user-sdk)
1. [Access the patient information](#access-the-patient-information)
1. [Update the patient information](#update-the-patient-information)


### Instantiate the User SDK

Use a valid `AuthenticatedContext` to initialize the User SDK — it is created by the Auth SDK when a user has successfully authenticated.

```swift
import BabylonAuthSDK
import BabylonUserSDK

// Obtained via the Auth SDK
let context: BabylonAuthSDK.AuthenticatedContext

// Instantiate the User SDK
let user = BabylonUserSDK.User(with: context)
```

### Access the patient information

Invoking `patient(for:)` on `BabylonUserSDK.User` with the target patient ID would return a `SignalProducer` which fetches the latest `Patient` object from the Babylon
service.

The patient ID of the currently logged in user can be obtained via the `AuthenticatedContext`.

```swift
let context: BabylonAuthSDK.AuthenticatedContext
let user: BabylonUserSDK.User

user.patient(for: context.patientID).startWithResult { result in
    switch result {
    case let .success(patient):
        print("Patient Email: \(patient.email ?? "N/A")")
    case let .failure(error):
        print("Failure: \(error)")
    }
}
```

### Update the patient information

Invoking `update(_:for:)` on `BabylonUserSDK.User` with an update object and the target patient ID would return a `SignalProducer` which updates the patient via the Babylon service, and yields the updated `Patient` object.

The patient ID of the currently logged in user can be obtained via the `AuthenticatedContext`.

Not all the fields of the `Patient` object can be updated via the SDK. Check `PatientUpdateRequest` for the available options.

```swift
let context: BabylonAuthSDK.AuthenticatedContext
let user: BabylonUserSDK.User

// Construct the update object
let request = PatientUpdateRequest([
    .email("example@babylonhealth.com")
])

user.update(request, for: context.patientID).startWithResult { result in
    switch result {
    case let .success(patient):
        print("Updated Patient Email: \(patient.email)")
    case let .failure(error):
        print("Failure: \(error)")
    }
}
```

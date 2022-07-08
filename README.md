# SociallyFire

SociallyFire(SF) is a framework to help building Soical apps.

It is a derived version of [fireflutter](https://pub.dev/packages/fireflutter) that is tightly coupled with Flutter.
And It is now trying to decouple from Flutter by implementing its core parts into cloud functions(event trigger). So, the final version of SF would work as frame agnostic.

# Test

Perfect TDD is the ultimate goal of this project. The code of `cloud functions` is under `functions` folder and the tests are under `functions/tests` folder. To test, enter `functions/tests` folder first.

## Testing the test system.

- To test if the testing is working, run `npm run test:test`.

- To test if firebase connection is working, run `npm run test:firebase-connection`.

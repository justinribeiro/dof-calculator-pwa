# dof-calculator-pwa
> A tiny no-frills depth of field progressive web app for film cameras.

![dof-calculator pwa run_(Nexus 5X) __size](https://user-images.githubusercontent.com/643503/58516939-85033680-815e-11e9-9ff7-67d5f1a46db1.png)

## Why?

Because this is just one of a series of utility PWA's I've had lying around that I use that might be useful to other folks.

## Dev

Hop into the `src` folder and run the local web server of your choice. No specific tool required.

## Build

I didn't really wrap this with build tooling, but I did crunch it down to 1.7K gzip'ed for fun using closure compiler and http-minifier. The rest is just some fancy Linux CLI jumping and sed (and I almost just used a make file instead ;-).

```sh
$ yarn install
$ yarn dist
```

## FAQ

1. How does this calculate depth of field?
This is a pretty basic calc that you can find on the likes of [Wikipedia](https://en.wikipedia.org/wiki/Depth_of_field) or any of the many DoF calculators out there. This is not a lensmaker calculation (which is more involved).

2. How does this calculate circle of confusion?
Via: `CoC = 1 / (lines/mm * (diagonal^8x10 print / diagonal^filmFormat))`, where lines/mm is 5.

3. Why does this use 5 lines per millimeter as the basis for circle of confusion calculation?
Personal preference.

4. Why doesn't this include tilt degree?
If I'm using tilt/swing, I've got a loupe on the ground glass. I don't find the calculation for Scheimpflug wedge particularly useful in the field.
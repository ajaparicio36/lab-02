module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // roots: ['<rootDir>/src'],
  testRegex: "/__tests__/.*\\.spec\\.ts$",
  transform: {
    "^.+\\.tsx?$": "@swc/jest",
  },
  verbose: true,
  forceExit: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

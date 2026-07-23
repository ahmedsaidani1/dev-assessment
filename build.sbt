name := """task-management-legacy"""
organization := "com.example"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.13.12"

// Resolve dependency conflicts
ThisBuild / libraryDependencySchemes += "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always

libraryDependencies ++= Seq(
  guice,
  javaJpa,
  "com.h2database" % "h2" % "2.1.214",
  "org.hibernate" % "hibernate-core" % "5.6.15.Final"
)

-- CreateTable
CREATE TABLE "StudentActivities" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "interests" JSONB NOT NULL DEFAULT '[]',
    "coursePlan" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentActivities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentExams" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "testPreference" TEXT,
    "apCourses" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentExams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentColleges" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "majorAnswers" JSONB NOT NULL DEFAULT '{}',
    "collegeList" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentColleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentEssays" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "driveLink" TEXT,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentEssays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentRecLetters" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "checklist" JSONB NOT NULL DEFAULT '{}',
    "teachers" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentRecLetters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentPortals" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "portals" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentPortals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDecide" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "decisions" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentDecide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentFinancialAid" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "fafsaChecklist" JSONB NOT NULL DEFAULT '{}',
    "scholarshipAnswers" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentFinancialAid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDeadlines" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "manualDeadlines" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentDeadlines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentActivities_studentId_key" ON "StudentActivities"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentExams_studentId_key" ON "StudentExams"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentColleges_studentId_key" ON "StudentColleges"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentEssays_studentId_key" ON "StudentEssays"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentRecLetters_studentId_key" ON "StudentRecLetters"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPortals_studentId_key" ON "StudentPortals"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDecide_studentId_key" ON "StudentDecide"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentFinancialAid_studentId_key" ON "StudentFinancialAid"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDeadlines_studentId_key" ON "StudentDeadlines"("studentId");

-- AddForeignKey
ALTER TABLE "StudentActivities" ADD CONSTRAINT "StudentActivities_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExams" ADD CONSTRAINT "StudentExams_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentColleges" ADD CONSTRAINT "StudentColleges_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEssays" ADD CONSTRAINT "StudentEssays_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentRecLetters" ADD CONSTRAINT "StudentRecLetters_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPortals" ADD CONSTRAINT "StudentPortals_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDecide" ADD CONSTRAINT "StudentDecide_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFinancialAid" ADD CONSTRAINT "StudentFinancialAid_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDeadlines" ADD CONSTRAINT "StudentDeadlines_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

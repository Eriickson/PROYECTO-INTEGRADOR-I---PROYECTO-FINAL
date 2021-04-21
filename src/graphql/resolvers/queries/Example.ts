import moment, { Moment } from "moment";

function deductTime(createdAt: string): string {
  // Combertimos la fecha de creacion a formato de moment
  const createdAtLocal: Moment = moment(createdAt, "HH:mm:ss");

  const startTime: Moment = moment("17:00:00", "HH:mm:ss");
  const endTime: Moment = moment("08:00:00", "HH:mm:ss");

  const diffStartTime: number = startTime.diff(createdAtLocal, "s");
  const diffEndTime: number = endTime.diff(createdAtLocal, "s");
  // const insideRange =

  if (diffStartTime <= 0 || diffEndTime > 0) {
    return "08:00:00";
  }

  return createdAt;
}

export default {
  Query: {
    testTime() {
      const time1 = deductTime("04:00:00");
      const time2 = deductTime("08:14:02");
      const time3 = deductTime("11:34:44");
      const time4 = deductTime("17:33:44");
      const time5 = deductTime("21:03:06");
      const time6 = deductTime("16:59:59");
      const time7 = deductTime("17:00:00");
      const time8 = deductTime("07:59:59");

      console.log({ time1, time2, time3, time4, time5, time6, time7, time8 });

      // start time and end time
    },
  },
};

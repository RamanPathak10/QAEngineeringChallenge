import {calculatePartHealth, calculateMachineHealth} from '../calculations';
import {
  MachineType,
  WeldingRobotPart,
  partInfo,
} from '../../native-app/data/types';

describe('calculatePartHealth', () => {
  it('calculates part health correctly', () => {
    const machineName: MachineType = MachineType.WeldingRobot;
    const part: partInfo = {name: WeldingRobotPart.ErrorRate, value: 0.5};
    const expectedHealth = 72.22222222222223;

    const result = calculatePartHealth(machineName, part);
    expect(result).toBe(expectedHealth);
  });
});

describe('calculateMachineHealth', () => {
  it('calculates machine health correctly', () => {
    const machineName: MachineType = MachineType.WeldingRobot;
    const parts = [
      {name: WeldingRobotPart.ErrorRate, value: 0.5},
      {name: WeldingRobotPart.VibrationLevel, value: 4.0},
      {name: WeldingRobotPart.ElectrodeWear, value: 0.8},
      {name: WeldingRobotPart.ShieldingPressure, value: 12.0},
      {name: WeldingRobotPart.WireFeedRate, value: 7.5},
      {name: WeldingRobotPart.ArcStability, value: 92.0},
      {name: WeldingRobotPart.SeamWidth, value: 1.5},
      {name: WeldingRobotPart.CoolingEfficiency, value: 85.0},
    ];
    const expectedHealth = 76.70138888888889;

    const result = calculateMachineHealth(machineName, parts);
    expect(result).toBe(expectedHealth);
  });
});

describe('calculatePartHealth', () => {
  it('should return a score of 100 for a part within optimal range', () => {
    const machineName = MachineType.WeldingRobot;
    const part = { name: WeldingRobotPart.ErrorRate, value: 0.5 };
    const expectedScore = 72.22222222222223;

    const result = calculatePartHealth(machineName, part);

    expect(result).toBe(expectedScore);
  });

  it('should return a score between 50 and 100 for a part within normal range', () => {
    const machineName = MachineType.WeldingRobot;
    const part = { name: WeldingRobotPart.ErrorRate, value: 0.5 };
    const expectedMinScore = 50;
    const expectedMaxScore = 100;

    const result = calculatePartHealth(machineName, part);

    expect(result).toBeGreaterThanOrEqual(expectedMinScore);
    expect(result).toBeLessThanOrEqual(expectedMaxScore);
  });

  it('should return a score between 0 and 50 for a part within abnormal range', () => {
    const machineName = MachineType.WeldingRobot;
    const part = { name: WeldingRobotPart.ErrorRate, value: 1.25 };
    const expectedMinScore = 0;
    const expectedMaxScore = 50;

    const result = calculatePartHealth(machineName, part);

    expect(result).toBeGreaterThanOrEqual(expectedMinScore);
    expect(result).toBeLessThanOrEqual(expectedMaxScore);
  });

  it('should return a score of 0 for a part outside all ranges', () => {
    const machineName = MachineType.WeldingRobot;
    const part = { name: WeldingRobotPart.ErrorRate, value: 10 };
    const expectedScore = 0;

    const result = calculatePartHealth(machineName, part);

    expect(result).toBe(expectedScore);
  });

  it('should return 0 when the machine name is not found in machineData', () => {
    const machineName = <MachineType>"unknown";
    const part = { name: WeldingRobotPart.ErrorRate, value: 0.5 };
    const expectedScore = 0;

    const result = calculatePartHealth(machineName, part);

    expect(result).toBe(expectedScore);
  });

  it('should return -1 when the part name is not found in machineInfo', () => {
    const machineName = MachineType.WeldingRobot;
    const part = { name: <WeldingRobotPart>"unknown", value: 0.5 };
    const expectedScore = -1;

    const result = calculatePartHealth(machineName, part);

    expect(result).toBe(expectedScore);
  });
});

describe('calculateMachineHealth', () => {
  it('should return 0 when no parts are provided', () => {
    const machineName = MachineType.WeldingRobot;
    const parts: partInfo[] = [];
    const expectedScore = 0;

    const result = calculateMachineHealth(machineName, parts);

    expect(result).toBe(expectedScore);
  });

  it('should calculate the average score for provided parts', () => {
    const machineName = MachineType.WeldingRobot;
    const parts: partInfo[] = [
      { name: WeldingRobotPart.ErrorRate, value: 0.5 },
      { name: WeldingRobotPart.VibrationLevel, value: 4.0 },
      { name: WeldingRobotPart.ElectrodeWear, value: 0.8 },
    ];
    const expectedScore = 82.87037037037037;

    const result = calculateMachineHealth(machineName, parts);

    expect(result).toBe(expectedScore);
  });

  it('should ignore parts with a score of -1', () => {
    const machineName = MachineType.WeldingRobot;
    const parts: partInfo[] = [
      { name: WeldingRobotPart.ErrorRate, value: 0.6 },
      { name: <WeldingRobotPart>"unknown", value: -1 }, // This part should be ignored
      { name: WeldingRobotPart.ElectrodeWear, value: 0.8 },
    ];
  
    // Filter out parts with a score of -1 and calculate the average
    const validParts = parts.filter((part) => part.value !== -1);
    const validPartScores = validParts.map((part) =>
      calculatePartHealth(machineName, part)
    );
  
    const expectedScore =
      validPartScores.reduce((sum, score) => sum + score, 0) /
      validPartScores.length;
  
    const result = calculateMachineHealth(machineName, parts);
  
    expect(result).toBe(expectedScore);
  });

  it('should return 0 when no valid parts are provided', () => {
    const machineName = MachineType.WeldingRobot;
    const parts: partInfo[] = [
      { name: <WeldingRobotPart>"unknown1", value: 0.5 },
      { name: <WeldingRobotPart>"unknown2", value: 4.0 },
      { name: <WeldingRobotPart>"unknown3", value: 0.8 },
    ];
    const expectedScore = 0;

    const result = calculateMachineHealth(machineName, parts);

    expect(result).toBe(expectedScore);
  });
});

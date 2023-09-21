import { Request } from 'express';
import { getMachineHealth } from '../machineHealth';

// Mock the calculateMachineHealth function
jest.mock('../calculations', () => ({
    calculateMachineHealth: jest.fn(),
  }));

  describe('getMachineHealth', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock function calls after each test
    });
  
    it('should return error for missing machines data', () => {
      const req: Request = {
        body: {},
      } as Request;
  
      const result = getMachineHealth(req);
  
      expect(result).toEqual({ error: 'Invalid input format' });
    });


  it('should return error for invalid machine data format', () => {
    const req: Request = {
      body: {
        machines: null, // null machine data format
      },
    } as Request;

    const result = getMachineHealth(req);

    expect(result).toEqual({ error: 'Invalid input format' });
  });


it('should return factory score and machine scores for valid input', () => {
    const req: Request = {
      body: {
        machines: {
          assemblyLine: {
            alignmentAccuracy: '0.5',
          },
          weldingRobot: {
            vibrationLevel: '4.0',
            electrodeWear: '0.8',
          },
        },
      },
    } as Request;

    // Mock the calculateMachineHealth function to return known values
    const calculateMachineHealthMock = require('../calculations').calculateMachineHealth;
    calculateMachineHealthMock
      .mockReturnValueOnce(42.0) // Assembly Line score
      .mockReturnValueOnce(38.0); // Welding Robot score

    const result = getMachineHealth(req);

    expect(result).toEqual({
      factory: '40.00', // Average of machine scores
      machineScores: {
        assemblyLine: '42.00',
        weldingRobot: '38.00',
      },
    });

    // Ensure calculateMachineHealth was called with the correct arguments
    expect(calculateMachineHealthMock).toHaveBeenCalledWith('assemblyLine', [
      { name: 'alignmentAccuracy', value: 0.5 },
    ]);
    expect(calculateMachineHealthMock).toHaveBeenCalledWith('weldingRobot', [
      { name: 'vibrationLevel', value: 4.0 },
      { name: 'electrodeWear', value: 0.8 },
    ]);
  });

  it('should handle empty machine data', () => {
    const req: Request = {
      body: {
        machines: {}, // Empty machine data
      },
    } as Request;

    const result = getMachineHealth(req);

    expect(result).toEqual({ factory: '0.00', machineScores: {} });
  });

  it('should handle single machine with valid input', () => {
    const req: Request = {
      body: {
        machines: {
          assemblyLine: {
            alignmentAccuracy: '0.5',
          },
        },
      },
    } as Request;

    // Mock the calculateMachineHealth function to return a known value
    const calculateMachineHealthMock = require('../calculations').calculateMachineHealth;
    calculateMachineHealthMock.mockReturnValueOnce(42.0);

    const result = getMachineHealth(req);

    expect(result).toEqual({
      factory: '42.00', // Factory score is the same as the single machine score
      machineScores: {
        assemblyLine: '42.00',
      },
    });

    // Ensure calculateMachineHealth was called with the correct arguments
    expect(calculateMachineHealthMock).toHaveBeenCalledWith('assemblyLine', [
      { name: 'alignmentAccuracy', value: 0.5 },
    ]);
  });

});
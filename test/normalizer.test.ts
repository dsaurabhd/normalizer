import fs from 'fs';
import { NormalizedUserRecord, UserRecord } from "../src/userSchema";
import { legacyRecordValidation } from "../src/validator";

describe('Normalizer tests', () => {

  // case 1: Data comes in legacy format, no need of any normalization
  it('[Happy Path] Case 1: Legacy data flows through without any normalization', () => {

    const input = {
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const result = NormalizedUserRecord.parse(input);
    expect(result).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

  });

  // case 2: Id could be a string or integer, normalized data should come clean with id as string
  it('Normalization Case 2: Id could be a string or integer, normalized data should come clean with id as string', () => {

    const input = {
      id: 1005,
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const result = NormalizedUserRecord.parse(input);

    expect(result).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

  });

  // case 3: Happy Path 3: Id could have an alias of user_id  or userId with either string or integer value
  it('Normalization Case 3: Id could have an alias of user_id  or userId ', () => {

    const input = {
      user_id: 1005,
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_2 = {
      userId: 1005,
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_3 = {
      userId: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const result = NormalizedUserRecord.parse(input);
    const result_2 = NormalizedUserRecord.parse(input_2);
    const result_3 = NormalizedUserRecord.parse(input_2);

    expect(result).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_2).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_3).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

  });

  // case 4: Happy Path 4 : Phone could be saved with different structures like primaryPhone, contactPhone or "phones":["+1-555-287-5028"]
  it('Normalization Case 4: Phone could be saved with different structures like primaryPhone, contactPhone or "phones":["+1-555-287-5028"]', () => {

    const input = {
      id: 1005,
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_2 = {
      id: 1005,
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      contactPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_3 = {
      id: 1005,
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      phones: ["+1-555-175-8729"],
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const result = NormalizedUserRecord.parse(input);
    const result_2 = NormalizedUserRecord.parse(input_2);
    const result_3 = NormalizedUserRecord.parse(input_3);

    expect(result).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_2).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_3).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

  });

  //  Full name could come as full_name or fullName or "name":{"first":"Carlos","last":"Doe"}
  it('Normalization Case 5: Full name could come as full_name or fullName or "name":{"first":"Carlos","last":"Doe"}', () => {

    const input = {
      id: 1005,
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_2 = {
      id: 1005,
      full_name: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_3 = {
      id: 1005,
      name: { "first": "Bob", "last": "Lee" },
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const result = NormalizedUserRecord.parse(input);
    const result_2 = NormalizedUserRecord.parse(input_2);
    const result_3 = NormalizedUserRecord.parse(input_3);

    expect(result).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_2).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_3).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

  });

  // Active flag could come as status: "inactive", status_code: "DISABLED", accountStatus: "I",
  it('Normalization Case 6: Variants of the isActive flag ["A", "active", "OK"]', () => {

    const input = {
      id: 1005,
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      status: "inactive",
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_2 = {
      id: 1005,
      full_name: "Bob Lee",
      email: "bob.lee@example.com",
      status_code: "DISABLED",
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_3 = {
      id: 1005,
      name: { "first": "Bob", "last": "Lee" },
      email: "bob.lee@example.com",
      accountStatus: "I",
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const result = NormalizedUserRecord.parse(input);
    const result_2 = NormalizedUserRecord.parse(input_2);
    const result_3 = NormalizedUserRecord.parse(input_3);

    expect(result).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_2).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_3).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

  });

  // Roles could come as roles, role_list
  it('Normalization Case 7: Variants of the roles array and field', () => {

    const input = {
      id: 1005,
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      status: "inactive",
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_2 = {
      id: 1005,
      full_name: "Bob Lee",
      email: "bob.lee@example.com",
      status_code: "DISABLED",
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      role_list: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const result = NormalizedUserRecord.parse(input);
    const result_2 = NormalizedUserRecord.parse(input_2);

    expect(result).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_2).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

  });

  it('Normalization Case 8: Variants of the createdAt field', () => {

    const input = {
      id: 1005,
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      status: "inactive",
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_2 = {
      id: 1005,
      full_name: "Bob Lee",
      email: "bob.lee@example.com",
      status_code: "DISABLED",
      joined_date: "29-09-2024",
      primaryPhone: "+1-555-175-8729",
      role_list: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const input_3 = {
      id: 1005,
      full_name: "Bob Lee",
      email: "bob.lee@example.com",
      status_code: "DISABLED",
      created: "29-09-2024",
      primaryPhone: "+1-555-175-8729",
      role_list: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const result = NormalizedUserRecord.parse(input);
    const result_2 = NormalizedUserRecord.parse(input_2);
    const result_3 = NormalizedUserRecord.parse(input_3);

    expect(result).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_2).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T00:00:00.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

    expect(result_3).toEqual({
      id: "1005",
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      isActive: false,
      createdAt: "2024-09-29T00:00:00.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    });

  });


  it('Validation Fails # 1: Id field is not present in any form in payload', () => {

    const input = {
      fullName: "Bob Lee",
      email: "bob.lee@example.com",
      status: "inactive",
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const result = NormalizedUserRecord.parse(input);
    expect(legacyRecordValidation(result).success === false);
    expect(legacyRecordValidation(result).error?.message.toString().includes("id must not be unknown")).toBeTruthy();
  });

  it('Validation Fails # 2: Name field is not present in any form in payload', () => {

    const input = {
      id: "1005",
      email: "bob.lee@example.com",
      status: "inactive",
      createdAt: "2024-09-29T20:41:42.000Z",
      primaryPhone: "+1-555-175-8729",
      roles: [
        "moderator",
        "user",
        "admin"
      ],
      preferredContactMethod: "phone"
    }

    const result = NormalizedUserRecord.parse(input);
    expect(legacyRecordValidation(result).success === false);
    expect(legacyRecordValidation(result).error?.message.toString().includes("name cannot be unknown")).toBeTruthy();
  });

  it('Load Test # 1: Adhoc inputs from stream ( 1k records) ', () => {

    const inputPath = 'output.json';
    const fileContent = fs.readFileSync(inputPath, 'utf-8');
    const rawData = JSON.parse(fileContent);

    // Normalize and validate
    const normalized: UserRecord[] = rawData.map((item: unknown, idx: number) => {
      try {
        return NormalizedUserRecord.parse(item);
      } catch (err) {
        console.warn(`⚠️ Record ${idx} failed:`, (err as Error).message);
        return null;
      }
    }).filter(Boolean);

    const results = normalized.map(record => legacyRecordValidation(record));
    results.forEach(result => expect(result.success).toBeTruthy());
  });

  it('Load Test # 2: Adhoc inputs from stream ( 20k records)', () => {

    const inputPath = 'output_large.json';
    const fileContent = fs.readFileSync(inputPath, 'utf-8');
    const rawData = JSON.parse(fileContent);

    // Normalize and validate
    const normalized: UserRecord[] = rawData.map((item: unknown, idx: number) => {
      try {
        return NormalizedUserRecord.parse(item);
      } catch (err) {
        console.warn(`⚠️ Record ${idx} failed:`, (err as Error).message);
        return null;
      }
    }).filter(Boolean);

    const results = normalized.map(record => legacyRecordValidation(record));
    results.forEach(result => expect(result.success).toBeTruthy());
  });

});

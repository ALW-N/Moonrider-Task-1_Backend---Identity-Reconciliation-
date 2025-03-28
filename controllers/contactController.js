const { Contact } = require("../models");
const { Op } = require("sequelize");

const identifyContact = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phoneNumber required" });
  }

  try {
    // Fetch all contacts that match either email or phoneNumber
    let existingContacts = await Contact.findAll({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
      order: [["createdAt", "ASC"]], // Get the oldest contact first
    });

    if (existingContacts.length === 0) {
      // No matching contact found, create a new primary contact
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });

      return res.json({
        primaryContactId: newContact.id,
        emails: [newContact.email].filter(Boolean),
        phoneNumbers: [newContact.phoneNumber].filter(Boolean),
        secondaryContactIds: [],
      });
    }

    // Identify the oldest primary contact
    let primaryContact = existingContacts.find(
      (contact) => contact.linkPrecedence === "primary"
    );

    if (!primaryContact) {
      primaryContact = existingContacts[0]; // First contact becomes primary
    }

    // Convert all other primary contacts into secondary and update linkedId
    for (let contact of existingContacts) {
      if (contact.id !== primaryContact.id && contact.linkPrecedence === "primary") {
        // Update existing primary to secondary
        await contact.update({ linkPrecedence: "secondary", linkedId: primaryContact.id });

        // Also update any contacts linked to the old primary to point to the new primary
        await Contact.update(
          { linkedId: primaryContact.id },
          { where: { linkedId: contact.id } }
        );
      }
    }

    // Refresh contacts to include updated secondary links
    existingContacts = await Contact.findAll({
      where: {
        [Op.or]: [{ email }, { phoneNumber }, { linkedId: primaryContact.id }],
      },
    });

    // Extract all unique emails and phoneNumbers
    let emailsSet = new Set();
    let phoneNumbersSet = new Set();
    let secondaryContacts = [];

    existingContacts.forEach((contact) => {
      if (contact.email) emailsSet.add(contact.email);
      if (contact.phoneNumber) phoneNumbersSet.add(contact.phoneNumber);
      if (contact.id !== primaryContact.id) {
        secondaryContacts.push(contact.id);
      }
    });

    // Add new secondary contact if it's a completely new email or phoneNumber
    if (email && !emailsSet.has(email)) {
      const newSecondary = await Contact.create({
        email,
        phoneNumber: null, // Avoid duplicating phone
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      });
      secondaryContacts.push(newSecondary.id);
      emailsSet.add(email);
    }

    if (phoneNumber && !phoneNumbersSet.has(phoneNumber)) {
      const newSecondary = await Contact.create({
        email: null, // Avoid duplicating email
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      });
      secondaryContacts.push(newSecondary.id);
      phoneNumbersSet.add(phoneNumber);
    }

    // Return the consolidated response
    res.json({
      primaryContactId: primaryContact.id,
      emails: [...emailsSet],
      phoneNumbers: [...phoneNumbersSet],
      secondaryContactIds: secondaryContacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { identifyContact };

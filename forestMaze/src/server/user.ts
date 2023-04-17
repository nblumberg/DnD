import { Request, Response } from 'express';
import { errorResponse } from './error';

const allUsers = {
  Eaton: 'Ser Eaton Dorito',
  Harrow: 'Harrow Zinvaris',
  John: 'John Rambo McClane',
  Nacho: 'Nacho Chessier IV',
  Rhiannon: 'Rhiannon Fray',
  Throne: 'Throne',
  DM: 'DM',
};

const activeUsers = new Set<string>();

export function getUsers(req: Request, res: Response) {
  if (req.query.active === 'true') {
    getActiveUsers(req, res);
  } else {
    getAllUsers(req, res);
  }
}

function getAllUsers(req: Request, res: Response) {
  res.send(JSON.stringify(allUsers));
}

function getActiveUsers(req: Request, res: Response) {
  res.send(JSON.stringify(Array.from(activeUsers.values())));
}

export function addUser(req: Request, res: Response) {
  const { user } = req.body;
  if (!Object.prototype.hasOwnProperty.call(allUsers, user)) {
    return errorResponse(res, 400, `${user} is not a recognized user`);
  }
  activeUsers.add(user);
  res.sendStatus(200);
}

export function removeUser(req: Request, res: Response) {
  const { userId } = req.params;
  if (!userId) {
    return errorResponse(res, 400, 'No user was specified to remove');
  }
  if (activeUsers.has(userId)) {
    activeUsers.delete(userId);
  }
  res.sendStatus(200);
}

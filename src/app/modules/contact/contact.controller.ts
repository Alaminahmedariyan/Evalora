import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";

import { contactService } from "./contact.service";

const createMessage = catchAsync(async (req: Request, res: Response) => {
	const result = await contactService.createMessage(req.body);

	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Thanks! Your message has been sent.",
		data: result,
	});
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
	const result = await contactService.getMessages(
		req.query as Record<string, unknown>,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Messages retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
	const message = await contactService.updateStatus(
		req.params.id as string,
		req.body,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Message updated successfully.",
		data: message,
	});
});

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
	const result = await contactService.deleteMessage(req.params.id as string);

	res.status(StatusCodes.OK).json({
		success: true,
		message: result.message,
		data: null,
	});
});

export const contactController = {
	createMessage,
	getMessages,
	updateStatus,
	deleteMessage,
};
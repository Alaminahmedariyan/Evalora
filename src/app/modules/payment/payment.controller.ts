import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";
import { companyService } from "../company/company.service";

import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const result = await paymentService.createCheckoutSession(currentUser.id, company.id, req.body);

	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Checkout session created.",
		data: result,
	});
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const result = await paymentService.getMyPayments(currentUser.id, req.query as Record<string, unknown>);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Payments retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
	const result = await paymentService.getAllPayments(req.query as Record<string, unknown>);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Payments retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const payment = await paymentService.getPaymentById(req.params.id as string, {
		id: currentUser.id,
		role: currentUser.role,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Payment retrieved successfully.",
		data: payment,
	});
});

export const paymentController = {
	createCheckoutSession,
	getMyPayments,
	getAllPayments,
	getPaymentById,
};
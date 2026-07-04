import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !image
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    if (store) {
      return NextResponse.json({ status: store.status });
    }

    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        {
          error: "Username Already Taken",
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    const response = await imagekit.files.upload({
      file: buffer.toString("base64"),
      fileName: image.name,
      folder: "logos",
    });

    const optimizedImage = `${process.env.IMAGEKIT_URL_ENDPOINT}/tr:q-auto,f-webp,w-512${response.filePath}`;

    console.log("userId:", userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    console.log("user:", user);

    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        contact,
        address,
        logo: optimizedImage,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: newStore.id } } },
    });

    return NextResponse.json({ message: "Applied, waiting for approval" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: error.code || error.message,
      status: 400,
    });
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    if (store) {
      return NextResponse.json({ status: store.status });
    }

    return NextResponse.json({ status: "no-store" });
  } catch (error) {
    return NextResponse.json({
      error: error.code || error.message,
      status: 400,
    });
  }
}

﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyChroniclesApi.Services.Urls;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MyChroniclesApi.Migrations
{
    [DbContext(typeof(UrlsService))]
    [Migration("20240526182451_CreateDecipherUrlsTable")]
    partial class CreateDecipherUrlsTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("DecipherUrlSteps", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("decipher_category")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("domain")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("step_number")
                        .HasColumnType("integer");

                    b.Property<int>("word_end")
                        .HasColumnType("integer");

                    b.Property<int>("word_start")
                        .HasColumnType("integer");

                    b.Property<string>("word_to_find")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.HasIndex("domain");

                    b.ToTable("decipher_steps");
                });

            modelBuilder.Entity("MyChroniclesApi.Models.Urls", b =>
                {
                    b.Property<string>("Domain")
                        .HasColumnType("text");

                    b.Property<string>("Selection_type")
                        .HasColumnType("text");

                    b.Property<DateTime>("date_time")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("dom_selector")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Domain");

                    b.ToTable("chronicle_extension_decipher");
                });

            modelBuilder.Entity("DecipherUrlSteps", b =>
                {
                    b.HasOne("MyChroniclesApi.Models.Urls", "urls")
                        .WithMany()
                        .HasForeignKey("domain")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("urls");
                });
#pragma warning restore 612, 618
        }
    }
}
